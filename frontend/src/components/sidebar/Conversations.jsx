import React from "react";
import Conversation from "./Conversation";
import useGetConversations from "../../hooks/useGetConversations";
import { getRandomEmoji } from "../../utils/emojis";

const Conversations = () => {
  const { loading, conversations } = useGetConversations();

  return (
    <>
      {!loading ? (
        <div className="py-2 flex flex-col overflow-auto">
          {conversations.map((conversation, idx) => (
            <Conversation
              key={conversation._id}
              conversation={conversation}
              emoji={getRandomEmoji()}
              lastIdx={idx === conversations.length - 1}
            />
          ))}
        </div>
      ) : (
        <div className="mx-auto flex items-center justify-center loading h-full loading-spinner"></div>
      )}
    </>
  );
};

export default Conversations;
