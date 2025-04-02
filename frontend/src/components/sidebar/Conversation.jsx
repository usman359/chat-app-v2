import React, { useEffect } from "react";
import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";

const Conversation = ({ conversation, emoji, lastIdx }) => {
  const {
    selectedConversation,
    setSelectedConversation,
    unreadMessages,
    setUnreadMessage,
    clearUnreadMessage,
  } = useConversation();
  const { socket, onlineUsers } = useSocketContext();

  const isSelected = selectedConversation?._id === conversation._id;
  const isOnline = onlineUsers.includes(conversation._id);
  const hasUnreadMessage = unreadMessages[conversation._id];

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (newMessage) => {
        if (
          newMessage.senderId === conversation._id &&
          (!selectedConversation ||
            selectedConversation._id !== conversation._id)
        ) {
          setUnreadMessage(conversation._id, true);
        }
      };

      socket.on("newMessage", handleNewMessage);

      return () => {
        socket.off("newMessage", handleNewMessage);
      };
    }
  }, [socket, conversation._id, selectedConversation, setUnreadMessage]);

  const handleSelectConversation = () => {
    setSelectedConversation(conversation);
    clearUnreadMessage(conversation._id);
  };

  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer ${
          isSelected ? "bg-sky-500" : ""
        }`}
        onClick={handleSelectConversation}
      >
        <div className={`avatar ${isOnline ? "online" : ""}`}>
          <div className="w-8 sm:w-12 rounded-full">
            <img src={conversation?.profilePic} alt="user avatar" />
          </div>
        </div>

        <div className="hidden sm:flex sm:flex-col sm:flex-1">
          <div className="flex gap-3 justify-between items-center">
            <p className="font-bold text-gray-200">{conversation?.fullName}</p>
            <div className="flex items-center gap-2">
              {hasUnreadMessage && !isSelected && (
                <div className="badge badge-md badge-primary animate-pulse">
                  New
                </div>
              )}
              <span className="text-xl">{emoji}</span>
            </div>
          </div>
        </div>
      </div>

      {!lastIdx && <div className="divider my-0 py-0 h-1" />}
    </>
  );
};

export default Conversation;
