import { Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import useSendMessage from "../../hooks/useSendMessage";
import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";
import { useAuthContext } from "../../context/AuthContext";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const { loading, sendMessage } = useSendMessage();
  const { socket } = useSocketContext();
  const { selectedConversation } = useConversation();
  const { authUser } = useAuthContext();
  const typingTimeoutRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Cleanup typing status when component unmounts or conversation changes
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTyping && socket && selectedConversation) {
        socket.emit("stopTyping", {
          recipientId: selectedConversation._id,
          senderId: authUser._id,
        });
        setIsTyping(false);
      }
    };
  }, [isTyping, socket, selectedConversation, authUser._id]);

  const handleTyping = () => {
    if (!socket || !selectedConversation) return;

    // Emit typing event
    socket.emit("typing", {
      recipientId: selectedConversation._id,
      senderId: authUser._id,
    });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        recipientId: selectedConversation._id,
        senderId: authUser._id,
      });
      setIsTyping(false);
    }, 1000);
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
    }
    handleTyping();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;

    // Clear typing status
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (isTyping && socket && selectedConversation) {
      socket.emit("stopTyping", {
        recipientId: selectedConversation._id,
        senderId: authUser._id,
      });
      setIsTyping(false);
    }

    await sendMessage(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="px-4 my-3 w-full max-w-full">
      <div className="w-full relative flex">
        <input
          type="text"
          className="border text-sm rounded-lg w-full p-2.5 pr-10 bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:outline-none"
          placeholder="Send a message"
          value={message}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="absolute right-0 inset-y-0 flex items-center px-3 text-gray-400 hover:text-white"
        >
          {loading ? (
            <div className="loading loading-spinner"></div>
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
