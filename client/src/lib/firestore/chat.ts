import {
  addDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { logFirebaseUpdate, logInfo } from "../logger";
import { trace } from "../tracers";
import { chatCollection } from "./locations";

export async function syncChat(
  setChatList: React.Dispatch<
    React.SetStateAction<{ [key: string]: ChatMessage }>
  >,
  roomID: string,
) {
  const chats = chatCollection();

  let q = query(
    chats,
    orderBy("timestamp", "desc"),
    where("roomID", "==", roomID),
    limit(100),
  );

  const unsub = onSnapshot(q, (docs) => {
    logInfo("syncing chat");
    trace("sync-chat", () => {
      setChatList((pc) => {
        let npc = { ...pc };
        docs.docChanges().forEach((change) => {
          let chat = change.doc;
          if (change.type === "added") {
            logFirebaseUpdate("ChatMessage added");
            npc[chat.id] = change.doc.data() as ChatMessage;
          }
          if (change.type === "modified") {
          }
          if (change.type === "removed") {
            logFirebaseUpdate("ChatMessage removed");
            delete npc[chat.id];
          }
        });
        return npc;
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
