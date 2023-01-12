
import { doc, getDoc, setDoc, collection, query, where, getDocs, deleteDoc, updateDoc, deleteField, onSnapshot, orderBy, QueryDocumentSnapshot, DocumentData} from "firebase/firestore";
import { firestore } from './firebase-init.js';
import { logError, logInfo, logUpdate, logWarning } from './logger.js';


const PRESENCE_LENGTH =  5 * 1000;


//Helpers
function roomDoc(roomID: string) {
  return doc(firestore, "rooms", roomID);
}

/**
 * gets all room data from firestore 
 * @param roomID 
 * @returns dictionary of room data 
 * @throws Error if room doesnt exist
 */
const getRoom = async (roomID: string) => {
  const roomRef = roomDoc(roomID);
  const room = await getDoc(roomRef);

  if (room.exists()) {
    return room.data();
  } else {
    throw Error(`Room ${room} doesn't exist`);
  }
}

/**
 * gets stream key from firestore, given a room name. 
 * @param roomID 
 * @returns string | undefined
 */
export const getStreamKey = async (roomID: string) => {
  try {
    const roomData = await getRoom(roomID);
    logInfo(`found data for ${roomID}: `, roomData);
    return roomData['stream_key'];

  } catch (e) {
    logError("Error in getting stream key from database for room: ", roomID);
    return undefined;
  }
}

/**
 * Creates a new relationship in DB between MUXID, roomID and Stream key. 
 * @param roomID 
 * @param muxID 
 * @param streamKey 
 */
export const writeNewStreamToDB = async (roomID: string, muxID: string, streamKey: string) => {
  logUpdate(`Tying MUX ID ${muxID} to roomID ${roomID} with key ${streamKey}`)
  await writeRoomIDToMUXID(roomID, muxID);
  await writeStreamKeyToDB(roomID, streamKey);
}
const writeRoomIDToMUXID = async (roomID: string, muxID: string) => {
  let docRef = await setDoc(doc(firestore, "mux_id", muxID ), { room_id: roomID});
}

const writeStreamKeyToDB = async (roomID: string, streamKey: string) => {
  let docRef = await setDoc(roomDoc(roomID), {stream_key: streamKey}, {merge: true});
}


/**
 * Finds a matching Room ID given a MUX ID by reading firebase
 * @param muxID 
 * @returns 
 * @throws error if the MUX ID doesnt match any room
 */

export const getRoomIDFromMUXID = async (muxID: string) => {
  let docRef = doc(firestore, "mux_id", muxID);
  let muxDoc = await getDoc(docRef);
  let muxData = muxDoc.data();
  if (!muxDoc.exists() || !muxData || !muxData['room_id']) {
    throw Error(`no room matching ${muxID}`);
  }
  logInfo(`Found room id ${muxData['room_id']} for muxID ${muxID}`);
  return muxData['room_id'];
}

export const writeStreamStateToDB = async (roomID: string, streamStatus: string) => {
  let docRef = await setDoc(roomDoc(roomID), {stream_status: streamStatus}, {merge: true});

}

export const writePlaybackIDToDB = async (roomID: string, playbackID: string) => {
  let docRef = await setDoc(roomDoc(roomID), {stream_playback_id:  playbackID}, {merge: true});
}

export const resetMuxFirestoreRelationship = async (roomID: string) => {  
  
  let roomRef = roomDoc(roomID);
  await updateDoc(roomRef, {
    stream_playback_id: deleteField(),
    stream_status: deleteField(),
    stream_key: deleteField()
  })

  let muxQuery = query(collection(firestore, "mux_id"), where("room_id", "==", roomID));
  const muxSnapshot = await getDocs(muxQuery);
  muxSnapshot.forEach(async (muxDoc) => {
    deleteDoc( doc( firestore, "mux_id", muxDoc.id))
  });
  
}


/**  */
export async function managePresenceInDB(allRoomNames: string[]) {
  const presenceRef = collection(firestore, "presence");
  
  const currentlyOnline = await Promise.all(allRoomNames.map(async (streamName) => {
    let q = query(presenceRef, where("room_id", "==", streamName), where("timestamp", ">=",  Date.now() - (1.2  * PRESENCE_LENGTH) ));
    const querySnapshot = await getDocs(q);
    let numResults = querySnapshot.size;
    
    return {roomID: streamName, numOnline: numResults}
  }));
  currentlyOnline.forEach(({roomID, numOnline}) => {
    setDoc(roomDoc(roomID), {num_online: numOnline}, {merge: true});
  })
  setTimeout(() => managePresenceInDB(allRoomNames), PRESENCE_LENGTH);
} 

async function setTransaction(id: string, status: string) {
  await setDoc(doc(firestore, "energy_transactions", id), {status: status}, {merge: true});
}
async function transact(transaction: any, id: string ) {
  let {status} = transaction;

  console.log("PROCESSING NEW TX");

  if (status == "SUCCESS" || status == "FAILED") {
    // TODO: Update this so its less reads mannnn
    logInfo("skipping since its already processed");
    return;
  }
  let { from, to, amount, timestamp} = transaction;
  if (! from || !to || ! amount || !timestamp) {
    logWarning("Transaction failing because the transaction doesnt have what it needs ", transaction);
    await setTransaction(id, 'FAILED');
    return;
  } 

  try {
    let room = await getRoom(to);
    let roomEnergy = room['energy'] || 0;
    await setDoc(roomDoc(to), {energy: roomEnergy + amount}, {merge: true})
    await setTransaction(id, 'SUCCESS');
    
    logUpdate("Transaction succeeded");
  } catch (e) {
    await setTransaction(id, 'FAILED');
    return;
  }
  
}


//Optimization: Group BY and then process each room together.
export async function transactionProcessor() {

  const transactionRef = collection(firestore, "energy_transactions");
  const q = query(transactionRef, where("status", "==", "PENDING"), orderBy("timestamp", "asc"));

  const newTransactions = await getDocs(q);

  if (newTransactions.size > 0) {
    console.log("Processing ...  new transactions #: ",  newTransactions.size);
    let processArray:QueryDocumentSnapshot<DocumentData>[] = []; 
    newTransactions.forEach((transactionDoc) => {
        processArray.push(transactionDoc);
    });
    
    await Promise.all(processArray.map(async (transactionDoc) => {
      await transact(transactionDoc.data(), transactionDoc.id);
    }))
  }

  setTimeout(transactionProcessor, 3000);
}

export async function presenceProcessor() {

  let collectionRef =  collection(firestore, "rooms");;
  let docs = await getDocs(collectionRef);
  
  let docNames: string[] = [];
  docs.forEach((d) => docNames.push(d.id));
  managePresenceInDB(docNames);
}

export async function chrisStickerScaler() {
  const roomRef = roomDoc("chrisy");
  const stickerRef = collection(roomRef, "stickers");

  const currentStickers = await getDocs(stickerRef);

  let processArray:QueryDocumentSnapshot<DocumentData>[] = []; 
  currentStickers.forEach((sticker) => {
      processArray.push(sticker);
  });
  await Promise.all(processArray.map(async (sticker) => {
    let data = sticker.data();
    //data.size = undefined;
    return setDoc(sticker.ref, { size: (data.size + 0.0005 || 0.03)}, {merge: true});
  }))

  setTimeout(chrisStickerScaler, 3000);
}