import { addDoc, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { validateRoomName } from "./converters";
import { chatCollection, roomDoc } from "./locations";

export async function syncChat(
  addChat: (id: string, chat: ChatMessage) => void,
  removeChat: (id: string) => void
) {
  const chats = chatCollection();
  const q = query(chats, orderBy("timestamp", "desc"), limit(200))
  const unsub = onSnapshot(q, (docs) => {
    docs.docChanges().forEach((change) => {
      let chat = change.doc;
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
  return unsub;
}
export async function addChatMessageDB(chat: ChatMessage) {
  const chats = chatCollection();
  await addDoc(chats,  chat);
}
