import React, { useEffect, useRef, useState } from "react";
import { useSocketContext } from "../../context/SocketContext";
import useGetMessages from "../../hooks/useGetMessages";
import useListenMessages from "../../hooks/useListenMessages";
import useConversation from "../../zustand/useConversation";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";

const Messages = () => {
  const { messages, loading } = useGetMessages();
  const lastMessageRef = useRef();
  const { socket } = useSocketContext();
  const { selectedConversation } = useConversation();
  const [isTyping, setIsTyping] = useState(false);

  useListenMessages();

  useEffect(() => {
    const handleTyping = ({ senderId }) => {
      console.log("Typing event received from:", senderId);
      console.log("Selected conversation:", selectedConversation?._id);
      if (selectedConversation?._id === senderId) {
        setIsTyping(true);
      }
    };

    const handleStopTyping = ({ senderId }) => {
      console.log("Stop typing event received from:", senderId);
      console.log("Selected conversation:", selectedConversation?._id);
      if (selectedConversation?._id === senderId) {
        setIsTyping(false);
      }
    };

    if (socket) {
      socket.on("typing", handleTyping);
      socket.on("stopTyping", handleStopTyping);

      return () => {
        socket.off("typing", handleTyping);
        socket.off("stopTyping", handleStopTyping);
      };
    }
  }, [socket, selectedConversation?._id]);

  // Reset typing state when conversation changes
  useEffect(() => {
    setIsTyping(false);
  }, [selectedConversation]);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages, isTyping]);

  return (
    <div className="px-4 flex-1 overflow-auto">
      {!loading &&
        messages.length > 0 &&
        messages.map((message, idx) => (
          <div
            key={message._id}
            ref={idx === messages.length - 1 ? lastMessageRef : null}
          >
            <Message message={message} />
          </div>
        ))}

      {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}

      {!loading && messages.length === 0 && (
        <p className="text-center text-gray-400">
          Send a message to start the conversation
        </p>
      )}

      {isTyping && (
        <div ref={lastMessageRef} className="chat chat-start">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Typing indicator"
                src={selectedConversation?.profilePic}
                className="bg-gray-600"
              />
            </div>
          </div>
          <div className="chat-bubble text-white bg-gray-600 min-h-8 flex items-center">
            <div className="flex items-center gap-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-white animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:0.4s]"></div>
              </div>
              <span className="text-sm">typing...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
