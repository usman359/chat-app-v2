import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import useListenMessages from "../../hooks/useListenMessages";
import useConversation from "../../zustand/useConversation";
import { useSocketContext } from "../../context/SocketContext";

const Messages = () => {
  const { messages, loading } = useGetMessages();
  const lastMessageRef = useRef();
  const { socket } = useSocketContext();
  const { selectedConversation } = useConversation();
  const [isTyping, setIsTyping] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useListenMessages();

  useEffect(() => {
    if (!socket) return;

    const handleTyping = ({ senderId }) => {
      if (selectedConversation?._id === senderId) {
        setIsTyping(true);
        setIsVisible(true);
      }
    };

    const handleStopTyping = ({ senderId }) => {
      if (selectedConversation?._id === senderId) {
        setIsVisible(false);
        // Delay the actual typing state change to allow for fade out animation
        setTimeout(() => {
          setIsTyping(false);
        }, 500); // Match this with CSS transition duration
      }
    };

    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [socket, selectedConversation?._id]);

  // Reset typing state when conversation changes
  useEffect(() => {
    setIsVisible(false);
    setTimeout(() => {
      setIsTyping(false);
    }, 500);
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
        <div
          ref={lastMessageRef}
          className={`chat chat-start transition-all duration-500 ease-in-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img
                src={selectedConversation?.profilePic}
                alt={selectedConversation?.fullName}
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
              <span className="text-sm">typing</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
