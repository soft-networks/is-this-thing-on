import {
  addDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { chatCollection } from "./locations";
import { logInfo } from "../logger";
import { trace } from "../tracers";

export async function syncChat(
  addChat: (id: string, chat: ChatMessage) => void,
  removeChat: (id: string) => void,
  roomID: string,
) {
  const chats = chatCollection();

  const q = query(
    chats,
    orderBy("timestamp", "desc"),
    where("roomID", "==", roomID),
    limit(100),
  );
  const unsub = onSnapshot(q, (docs) => {
    logInfo("syncing chat");
    trace("sync-chat", () => {
      docs.docChanges().forEach((change) => {
        const chat = change.doc;
        if (change.type === "added") {
          addChat(chat.id, change.doc.data() as ChatMessage);
        }
        if (change.type === "modified") {
        }
        if (change.type === "removed") {
          removeChat(chat.id);
        }
      });
    });
  });
  return unsub;
}
export async function addChatMessageDB(chat: ChatMessage) {
  trace("add-chat", () => {
    const chats = chatCollection();
    return addDoc(chats, chat);
  });
}
