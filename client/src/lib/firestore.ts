import { app } from "./firebase-init";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  onSnapshot,
  DocumentReference,
  getDoc,
  query,
  where,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { PRESENCE_LENGTH } from "../../../common/streamData";
import { create } from "domain";

const db = getFirestore(app);

//Helpers
//Invariant: Room exists with chat subcollection for now. But TODO if it doesnt.
function roomDoc(roomName: string) {
  // console.log("Room doc reference", roomName);
  return doc(db, "rooms", roomName);
}
function energyAccountDoc(userID: string) {
 return doc(collection(db, "energy_accounts"), userID);
}

function chatCollection(roomDoc: DocumentReference) {
  // console.log("Room chat doc reference", roomDoc);
  return collection(roomDoc, "chats");
}
function presenceCollection() {
  // console.log("Presence reference");
  return collection(db, "presence");
}
function validateRoomName(roomName: string) {
  if (!roomName || roomName == "") {
    return false;
  }
  return true;
}
function sanitizeRoomInfo(data: DocumentData, id: string): RoomInfo {
  return {
    streamPlaybackID: data["stream_playback_id"] || "",
    streamOwner: "bhavik",
    streamStatus: data["stream_status"] || "disconnected",
    numOnline: data["num_online"] || 0,
    roomName: id
  };
}
function sanitizeEnergyAccount(amount: number, id: string): EnergyAccount {
  return {
    userID: id,
    energy: amount
  }
}

//Room info
export async function syncRoomInfoDB(roomName: string, callback: (roomInfo: RoomInfo) => void) {
  if (!validateRoomName(roomName)) {
    return;
  }
  const unsub = onSnapshot(roomDoc(roomName), (doc) => {
    let data = doc.data();
    data && callback(sanitizeRoomInfo(data, doc.id));
  });
  return unsub;
}

export async function getRoomsWhereUserISAdmin(userID: string) {
  const q = query(collection(db, "rooms"), where("admins", "array-contains", userID));
  const querySnapshot = await getDocs(q);
  let numResults = querySnapshot.size;

  if (numResults == 0) {
    return undefined;
  }

  let roomInfo : RoomInfo[] = [];
  querySnapshot.forEach((doc) => roomInfo.push(sanitizeRoomInfo(doc.data(), doc.id)));
  return roomInfo;
}
export async function getRoomAdmins(roomID: string) {
  let roomRef = roomDoc(roomID);
  let roomDocument = await getDoc(roomRef);
  let data = roomDocument.data();
  return data && data["admins"] ? data["admins"] : [];
}

//Chat
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
  await addDoc(chats, chat);
}

//Presence
let activeTimeout: NodeJS.Timeout | undefined;
async function setPresenceDB(userID: string, roomName: string) {
  const newpresence = doc(presenceCollection(), userID);

  await setDoc(newpresence, {
    room_id: roomName,
    timestamp: Date.now(),
  });
}
export async function setUserHeartbeat(userID: string, roomName: string) {
  if (activeTimeout) {
    clearTimeout(activeTimeout);
  }
  await setPresenceDB(userID, roomName);
  activeTimeout = setTimeout(() => setUserHeartbeat(userID, roomName), PRESENCE_LENGTH);
}


//Energy
async function createEnergyAccount(docRef: DocumentReference) {
 const energyRef = await setDoc(docRef, { energy: 0 });
}
async function getOrCreateEnergyAccount(userID: string) {
  const energyAccountRef = energyAccountDoc(userID);
  const energyAccount = await getDoc(energyAccountRef);
  if (energyAccount.exists() && energyAccount.data()['energy'] != undefined) {
    return sanitizeEnergyAccount(energyAccount.data()['energy'], energyAccount.id);
  }
  await createEnergyAccount(energyAccountRef);
  return sanitizeEnergyAccount(0, userID);

}
export async function verifyBalanceGreaterThanAmount (userID: string, amount: number) {
  const account = await getOrCreateEnergyAccount(userID);
  return account.energy > amount;
}
export async function performTransaction(transaction: EnergyTransaction): Promise<EnergyTransactionPosted> {
    const transactionRef = await addDoc(collection(db, "energy_transactions"), { ...transaction, status: "PENDING" });
    return {
      ...transaction,
      id: transactionRef.id,
      status: {
        type: "PENDING"
      }
    }  
}
export async function syncEnergyAccount(userID: string, callback: (energyAccount: EnergyAccount) => void) {
  
  const account = await getOrCreateEnergyAccount(userID);
  callback(account);

  const unsub = onSnapshot(energyAccountDoc(userID), (doc) => {
    let data = doc.data();
    data && callback(sanitizeEnergyAccount(data['energy'], doc.id));
  });
  return unsub;
}
export async function syncTransactionStatus(transactionID: string, callback: (status: TransactionStatus) => void) {

  const unsub = onSnapshot(doc(db, "energy_transactions", transactionID), (doc) => {
    let data = doc.data();
    //TODO: why this check? 
    if (!data || !data.status) {
      console.warn("Edge case: transaction posted without pending status", data);
    }
    data && data.status && callback({type: data.status});
  })
  return unsub;
}