import React, { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation";
import { extractTime } from "../../utils/extractTime";

const Message = ({ message }) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();
  const [imageLoaded, setImageLoaded] = useState(false);
  const fromMe = message.senderId === authUser._id;
  const formattedTime = extractTime(message.createdAt);
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const profilePic = fromMe
    ? authUser.profilePic
    : selectedConversation?.profilePic;
  const bubbleClassName = fromMe ? "bg-blue-500" : "bg-gray-600";
  const messageOpacity = message.tempMessage ? "opacity-70" : "opacity-100";

  return (
    <div className={`chat ${chatClassName} ${messageOpacity}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full relative overflow-hidden bg-gray-300">
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gray-400" />
          )}
          <img
            src={profilePic}
            alt="user avatar"
            onLoad={() => setImageLoaded(true)}
            className={imageLoaded ? "opacity-100" : "opacity-0"}
            loading="lazy"
          />
        </div>
      </div>
      <div className={`chat-bubble text-white ${bubbleClassName} pb-2`}>
        {message.message}
      </div>
      <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
        {formattedTime}
      </div>
    </div>
  );
};

export default Message;
