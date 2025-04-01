import { Search } from "lucide-react";
import React, { useState } from "react";
import useGetConversations from "../../hooks/useGetConversations";
import useConversation from "../../zustand/useConversation";
import toast from "react-hot-toast";

const SearchInput = () => {
  const { setSelectedConversation } = useConversation();
  const { conversations } = useGetConversations();

  const [search, setSearch] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search) return;
    if (search.length < 3) {
      return toast.error("Search must be at least 3 characters long");
    }

    console.log(conversations);

    const conversation = conversations.find((c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase().trim())
    );
    console.log(conversation);
    if (conversation) {
      setSelectedConversation(conversation);
      setSearch("");
    } else {
      toast.error("Conversation not found");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Search..."
        className="input input-bordered rounded-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button type="submit" className="btn btn-circle bg-sky-500 text-white">
        <Search className="w-6 h-6 outline-none" />
      </button>
    </form>
  );
};

export default SearchInput;
