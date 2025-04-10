import React, { useEffect } from "react";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import { MessageSquare } from "lucide-react";
import useConversation from "../../zustand/useConversation";
import { useAuthContext } from "../../context/AuthContext";

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();

  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  const noChatSelected = !selectedConversation;
  return (
    <div className="w-[350px] flex-1 flex flex-col">
      {noChatSelected ? (
        <NoChatSelected />
      ) : (
        <>
          {/* Header */}
          <div className="bg-slate-500 px-4 py-2 mb-2">
            <span className="label-text">
              To:{" "}
              <span className="text-gray-900 font-bold">
                {selectedConversation.fullName}
              </span>
            </span>
          </div>

          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  );
};

export default MessageContainer;

const NoChatSelected = () => {
  const { authUser } = useAuthContext();

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
        <p>Welcome 👋 {authUser?.fullName} ❄️</p>
        <p>Select a chat to start messaging</p>
        <MessageSquare className="size-14 text-center" />
      </div>
    </div>
  );
};
