import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSocketContext } from "../../context/SocketContext";
import useSendMessage from "../../hooks/useSendMessage";
import useConversation from "../../zustand/useConversation";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const { loading, sendMessage } = useSendMessage();
  const { socket } = useSocketContext();
  const { selectedConversation } = useConversation();
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        socket?.emit("stopTyping", { receiverId: selectedConversation?._id });
      }
    };
  }, [socket, selectedConversation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      socket?.emit("stopTyping", { receiverId: selectedConversation._id });
    }

    await sendMessage(message);
    setMessage("");
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);

    if (!socket || !selectedConversation) return;

    socket.emit("typing", { receiverId: selectedConversation._id });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { receiverId: selectedConversation._id });
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="px-4 my-3 w-full max-w-full">
      <div className="w-full relative flex">
        <input
          type="text"
          className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white"
          placeholder="Send a message"
          value={message}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="absolute right-0 inset-y-0 flex items-center px-3 text-gray-400 hover:text-white"
          disabled={loading}
        >
          {loading ? (
            <div className="loading loading-spinner"></div>
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
