import { create } from "zustand";

const useConversation = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),
  messages: [],
  setMessages: (messages) => set({ messages }),
  isTyping: false,
  setIsTyping: (isTyping) => set({ isTyping }),
  unreadMessages: {}, // { conversationId: boolean }
  setUnreadMessage: (conversationId, hasUnread) =>
    set((state) => ({
      unreadMessages: {
        ...state.unreadMessages,
        [conversationId]: hasUnread,
      },
    })),
  clearUnreadMessage: (conversationId) =>
    set((state) => {
      const newUnreadMessages = { ...state.unreadMessages };
      delete newUnreadMessages[conversationId];
      return { unreadMessages: newUnreadMessages };
    }),
}));

export default useConversation;
