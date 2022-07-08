
import { app } from "./firebase-init";
import {getFirestore,  collection, doc, setDoc, DocumentReference, onSnapshot} from "firebase/firestore";

const db = getFirestore(app);


const roomRoot = collection(db, "testing");
const presenceCollection = collection(db, "presence");

export async function setRoom(roomName: string, addChat: (chat: ChatMessage) => void) {
  let docRef = await setDoc(doc(db, "testing", roomName), {
    name: roomName
  }, {merge: true});

  const chats = collection(doc(db, "testing", roomName), "chat");
  const unsubscribe = onSnapshot(chats, (docs) => { 

    docs.docChanges().forEach((change) => {
      if (change.type === "added") {
          addChat(change.doc.data() as ChatMessage);
      }
      if (change.type === "modified") {
          // Ignore
      }
      if (change.type === "removed") {
        //TODO!!
      }
    });
  });
  return unsubscribe;
  
}


export async function addChatMessageDB(roomName: string, message: ChatMessage) {
  
  console.log("adding message");
  const chats = collection(doc(db, "testing", roomName), "chat");
  const newChatRef = doc(chats);

  await setDoc(newChatRef, message)
}

let activeTimeout: NodeJS.Timeout | undefined;

async function setPresenceDB(userID: string, roomName: string) {
  const newpresence = doc(presenceCollection, userID);
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