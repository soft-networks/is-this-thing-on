import { addDoc, onSnapshot } from "firebase/firestore";
import { validateRoomName } from "./converters";
import { chatCollection, roomDoc } from "./locations";

export async function syncChat(
  roomName: string,
  addChat: (id: string, chat: ChatMessage) => void,
  removeChat: (id: string) => void
) {
  if (!validateRoomName(roomName)) {
    return;
  }
  const chats = chatCollection(roomDoc(roomName));
  const unsub = onSnapshot(chats, (docs) => {
    docs.docChanges().forEach((change) => {
      let chat = change.doc;

      if (change.type === "added") {
        addChat(chat.id, change.doc.data() as ChatMessage);
      }
      if (change.type === "modified") {
      }
      if (change.type === "removed") {
        console.log("chat removed");
        removeChat(chat.id);
      }
    });
  });
  return unsub;
}
export async function addChatMessageDB(roomName: string, chat: ChatMessage) {
  const chats = chatCollection(roomDoc(roomName));
  await addDoc(chats,  chat);
}
