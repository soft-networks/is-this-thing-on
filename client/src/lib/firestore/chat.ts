import {
  addDoc,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { logFirebaseUpdate, logInfo } from "../logger";
import { trace } from "../tracers";
import { chatCollection, statsCollection } from "./locations";
import db from "./init";


export function syncGlobalChatDisabled(callback: (isDisabled: boolean) => void) { 
  const isGlobalChatDisabled = doc(statsCollection(), "admin");
  const unsub = onSnapshot(isGlobalChatDisabled, (doc) => {
    const data = doc.data();
    if (!data || !data["chat_disabled"]) {
      callback(false);
    } else {
      callback(true);
    }
  });
  return unsub;
}

export async function syncChat(
  setChatList: React.Dispatch<
    React.SetStateAction<{ [key: string]: ChatMessage }>
  >,
  roomID: string,
  timestampFilter?: number,
) {
  const chats = chatCollection();

  let q = roomID === "admin" ? query(
    chats,
    orderBy("timestamp", "desc"),
    limit(100)
  ) : query(
    chats,
    orderBy("timestamp", "desc"),
    where("roomID", "==", roomID),
    limit(100)
  );

  if (timestampFilter) {
    q = query(q, where("timestamp", ">=", timestampFilter));
  }

  const unsub = onSnapshot(q, (docs) => {
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

export async function deleteChatMessageDB(chatID: string) {
  const chats = chatCollection();
  return deleteDoc(doc(chats, chatID));
}


