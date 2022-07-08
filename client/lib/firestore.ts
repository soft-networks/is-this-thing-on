
import { app } from "./firebase-init";
import {getFirestore,  collection, doc, setDoc, addDoc, onSnapshot, DocumentReference} from "firebase/firestore";

const db = getFirestore(app);

//Helpers
//Invariant: Room exists with chat subcollection for now. But TODO if it doesnt.
function roomDoc(roomName:string) {
  return doc(db, "rooms", roomName);
}
function chatCollection(roomDoc: DocumentReference) {
  return collection(roomDoc, "chats");
}
function presenceCollection() {
  return collection(db, "presence");
}

//Room info
export async function syncRoomInfoDB(roomName: string, callback: (roomInfo: RoomInfo) => void) {
  const unsub = onSnapshot(roomDoc(roomName), (doc) => {
    let data = doc.data();
    if (data) {
      callback({
        streamPlaybackID: data["stream_playback_id"] || "",
        streamOwner: "bhavik",
        streamStatus: data["stream_status"] || "disconnected",
      });
    }
});
return unsub;
}


//Chat
export async function syncChat(roomName: string, addChat: (id: string, chat: ChatMessage) => void, removeChat: (id:string)=>void) {
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
  await addDoc(chats, chat);
}


//Presence
let activeTimeout: NodeJS.Timeout | undefined;
async function setPresenceDB(userID: string, roomName: string) {
  const newpresence = doc(presenceCollection(), userID);
  await setDoc(newpresence, {
    room: roomName,
    time: Date.now(),
    userid: userID
  });
}
export async function setUserHeartbeat(userID: string, roomName: string) {
  await setPresenceDB(userID, roomName);
  activeTimeout = setTimeout(() => setUserHeartbeat(userID, roomName), 10000);
}
export async function detachUserHeartbeat(userID: string, roomName: string) {
  if (activeTimeout) {
    clearTimeout(activeTimeout);
  }
  setPresenceDB(userID, 'null');
}