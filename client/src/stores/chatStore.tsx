import create from "zustand";

import { logCallbackSetup, logFirebaseUpdate } from "../lib/logger";

interface ChatState {
  chats: { [key: string]: ChatMessage };
  initializeChats: (chats: { [key: string]: ChatMessage }) => void;
  addChat: (id: string, chat: ChatMessage) => void;
  removeChat: (id: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: {},
  initializeChats: (c) => {
    logFirebaseUpdate("CHAT was initialized...");
    set({ chats: c });
  },
  addChat: (id: string, chat: ChatMessage) => {
    set((p) => {
      let pc = p.chats;
      pc[id] = chat;
      return { chats: pc };
    });
  },
  removeChat: (id: string) => {
    set((p) => {
      let pc = p.chats;
      delete pc[id];
      return { chats: pc };
    });
  },
}));
