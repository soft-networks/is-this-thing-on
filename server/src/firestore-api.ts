
import { QueryDocumentSnapshot, DocumentData,Timestamp, FieldValue} from "firebase-admin/firestore";

import { firestore } from './firebase-init.js';
import { logError, logInfo, logUpdate, logWarning } from './logger.js';


const PRESENCE_LENGTH =  5 * 1000;


//Helpers
function roomDoc(roomID: string) {
  return firestore.collection("rooms").doc(roomID);
}

/**
 * gets all room data from firestore 
 * @param roomID 
 * @returns dictionary of room data 
 * @throws Error if room doesnt exist
 */
const getRoom = async (roomID: string) => {
  const roomRef = roomDoc(roomID);
  const room = await roomRef.get()

  if (room.exists) {
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
    return roomData?.['stream_key'];

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
  await firestore.collection("mux_id").doc(muxID).set({ room_id: roomID });
}

const writeStreamKeyToDB = async (roomID: string, streamKey: string) => {
  await roomDoc(roomID).set({ stream_key: streamKey }, { merge: true });
}


/**
 * Finds a matching Room ID given a MUX ID by reading firebase
 * @param muxID 
 * @returns 
 * @throws error if the MUX ID doesnt match any room
 */

export const getRoomIDFromMUXID = async (muxID: string) => {
  let docRef = firestore.collection("mux_id").doc(muxID);
  let muxDoc = await docRef.get();
  let muxData = muxDoc.data();
  if (!muxDoc.exists || !muxData || !muxData['room_id']) {
    throw Error(`no room matching ${muxID}`);
  }
  logInfo(`Found room id ${muxData['room_id']} for muxID ${muxID}`);
  return muxData['room_id'];
}

export const writeStreamStateToDB = async (roomID: string, streamStatus: string) => {
  await roomDoc(roomID).set({ stream_status: streamStatus }, { merge: true });
}

export const writePlaybackIDToDB = async (roomID: string, playbackID: string) => {
  await roomDoc(roomID).set({ stream_playback_id: playbackID }, { merge: true });
}

export const resetMuxFirestoreRelationship = async (roomID: string) => {  
  
  let roomRef = roomDoc(roomID);
  await roomRef.update({
    stream_playback_id: FieldValue.delete(),
    stream_status: FieldValue.delete(),
    stream_key: FieldValue.delete()
  });
  let muxQuery = firestore.collection("mux_id").where("room_id", "==", roomID);
  const muxSnapshot = await muxQuery.get();
  muxSnapshot.forEach(async (muxDoc) => {
    await muxDoc.ref.delete();
  });
}


/**  */
export async function managePresenceInDB(allRoomNames: string[]) {
  const presenceRef = firestore.collection("presence");
  
  const currentlyOnline = await Promise.all(allRoomNames.map(async (streamName) => {
    let q = presenceRef.where("room_id", "==", streamName).where("timestamp", ">=", Timestamp.fromMillis(Date.now() - (1.2 * PRESENCE_LENGTH)));
    const querySnapshot = await q.get();
    let numResults = querySnapshot.size;
    
    return {roomID: streamName, numOnline: numResults}
  }));
  
  await Promise.all(currentlyOnline.map(({roomID, numOnline}) => 
    roomDoc(roomID).set({num_online: numOnline}, {merge: true})
  ));
  
  setTimeout(() => managePresenceInDB(allRoomNames), PRESENCE_LENGTH);
} 

async function setTransaction(id: string, status: string) {
  await firestore.collection("energy_transactions").doc(id).set({status: status}, {merge: true});
}

export async function presenceProcessor() {
  let collectionRef = firestore.collection("rooms");
  let docs = await collectionRef.listDocuments();
  let docNames: string[] = [];
  docs.forEach((d) => docNames.push(d.id));
  managePresenceInDB(docNames);
}
