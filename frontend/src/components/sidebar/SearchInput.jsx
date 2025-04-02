import { Search, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import useGetConversations from "../../hooks/useGetConversations";
import useConversation from "../../zustand/useConversation";
import toast from "react-hot-toast";

const SearchInput = () => {
  const { setSelectedConversation } = useConversation();
  const { conversations } = useGetConversations();
  const [search, setSearch] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  useEffect(() => {
    if (showMobileSearch) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [showMobileSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search) return;
    if (search.length < 3) {
      return toast.error("Search must be at least 3 characters long");
    }

    const conversation = conversations.find((c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase())
    );

    if (conversation) {
      setSelectedConversation(conversation);
      setSearch("");
      setShowMobileSearch(false);
    } else {
      toast.error("No such user found!");
    }
  };

  return (
    <>
      {/* Mobile Search Icon */}
      <button
        onClick={() => setShowMobileSearch(true)}
        className="sm:hidden flex items-center justify-center w-12 h-12 rounded-full transition-colors"
      >
        <Search className="w-5 h-5 text-gray-300" />
      </button>

      {/* Mobile Search Modal */}
      {showMobileSearch && (
        <div className="fixed w-full inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4 sm:hidden">
          <div className="bg-gray-800 w-full max-w-md rounded-lg p-4 relative">
            <button
              onClick={() => setShowMobileSearch(false)}
              className="absolute right-5 top-9 text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
            <form onSubmit={handleSubmit} className="py-2">
              <input
                type="text"
                placeholder="Search users..."
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </form>
          </div>
        </div>
      )}

      {/* Desktop Search */}
      <form onSubmit={handleSubmit} className="hidden sm:block w-full">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full px-4 py-2 rounded-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <Search className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </form>
    </>
  );
};

export default SearchInput;
