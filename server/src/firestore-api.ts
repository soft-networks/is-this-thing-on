
import { doc, getDoc, setDoc, collection, query, where, getDocs, deleteDoc, updateDoc, deleteField, onSnapshot} from "firebase/firestore";
import { firestore } from './firebase-init.js';
import { logError, logInfo, logUpdate, logWarning } from './logger.js';
import STREAM_NAMES, { PRESENCE_LENGTH } from "../../common/streamData.js";

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
export async function managePresenceInDB() {
  const presenceRef = collection(firestore, "presence");
  const currentlyOnline = await Promise.all(STREAM_NAMES.map(async (streamName) => {
    let q = query(presenceRef, where("room_id", "==", streamName), where("timestamp", ">=",  Date.now() - (1.2  * PRESENCE_LENGTH) ));
    const querySnapshot = await getDocs(q);
    let numResults = querySnapshot.size;
    
    return {roomID: streamName, numOnline: numResults}
  }));
  currentlyOnline.forEach(({roomID, numOnline}) => {
    setDoc(roomDoc(roomID), {num_online: numOnline}, {merge: true});
  })
  setTimeout(managePresenceInDB, PRESENCE_LENGTH);
} 

async function failtransaction(id: string) {
  await setDoc(doc(firestore, "energy_transactions", id), {status: 'FAILED'}, {merge: true});
}
async function transact(transaction: any, id: string ) {
  let {status} = transaction;

  if (status == "SUCCESS" || status == "FAILED") {
    // TODO: Update this so its less reads mannnn
    logInfo("skipping since its already processed");
    return;
  }
  let { from, to, amount, timestamp} = transaction;
  if (! from || !to || ! amount || !timestamp) {
    logWarning("Transaction failing because the transaction doesnt have what it needs ", transaction);
    await failtransaction(id);
    return;
  } 
  const fromAccountRef = doc(firestore, "energy_accounts", from)
  const fromAccount = await getDoc(fromAccountRef);

  const toAccountRef = doc(firestore, "energy_accounts", to);
  const toAccount = await getDoc(toAccountRef);
  if (!fromAccount.exists() || !toAccount.exists() || fromAccount.data()['energy'] == undefined || toAccount.data()['energy'] == undefined ) {
    logWarning("Transaction failing because account doesnt exist", fromAccount.data(), toAccount.data());
    await failtransaction(id);
    return;
  };

  const newFromAccountEnergy = fromAccount.data()['energy'] - transaction.amount; 
  const newToAccountEnergy = toAccount.data()['energy']  + transaction.amount;

  await setDoc(fromAccountRef, {energy: newFromAccountEnergy}, {merge: true});
  await setDoc(toAccountRef, {energy: newToAccountEnergy}, {merge: true});
  await setDoc(doc(firestore, "energy_transactions", id), {status: "SUCCESS"}, {merge: true});

  logUpdate("Transaction succeeded");
}


//Maybe run this on a schedule too? That way actually i can retry as well lol jesus
export async function manageEnergyTxInDB() {
  const transactionRef = collection(firestore, "energy_transactions");
  const unsub = onSnapshot(transactionRef, (docs) => {
    docs.docChanges().forEach((change) => {
      let transaction = change.doc;
      if (change.type === "added") {
        try {
          console.log("Processing transaction" , transaction.id);
          transact(transaction.data(), transaction.id);
        } catch (e) {
          logError("Error with transaction " + transaction.id, (e as Error).message);
        }
      }
      if (change.type === "modified") {
        //UMM? lol. 
      }
    });
  });

}