import { DocumentData, FieldValue, QueryDocumentSnapshot, Timestamp } from "firebase-admin/firestore";
import { logError, logInfo, logUpdate, logWarning } from './logger.js';

import { firestore } from './firebase-init.js';

const PRESENCE_LENGTH =  5 * 1000;
const PRESENCE_CLEANUP_FREQUENCY = 10 * 1000;


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
export const getRoom = async (roomID: string) => {
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

/* API's to Connect RoomID to Stream Call ID */

export const connectStreamRoomDB = async (roomID: string, streamCallID: string) => {
  console.log("Connecting roomID: ", roomID, " to streamCallID: ", streamCallID);
  await writeRoomIDToStreamCallID(roomID, streamCallID);
}

const writeRoomIDToStreamCallID = async (roomID: string, streamCallID: string) => {
  await firestore.collection("stream_call_id").doc(streamCallID).set({ room_id: roomID });
}

export const getRoomIDFromStreamCallID = async (streamCallID: string) => {
  let docRef = firestore.collection("stream_call_id").doc(streamCallID);
  let streamCallDoc = await docRef.get();
  let streamCallData = streamCallDoc.data();
  if (!streamCallDoc.exists || !streamCallData || !streamCallData['room_id']) {
    throw Error(`no room matching ${streamCallID}`);
  }
  logInfo(`Found room id ${streamCallData['room_id']} for streamCall ${streamCallID}`);
  return streamCallData['room_id'];
}
/**
 * Creates a new relationship in DB between MUXID, roomID and Stream key. 
 * @param roomID 
 * @param muxID 
 * @param streamKey 
 */
export const connectMuxRoomDB = async (roomID: string, muxID: string, streamKey: string) => {
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
export function setupPresenceListener(allRoomNames: string[]) {
  const presenceRef = firestore.collection("presence");

  // Set up a listener for changes in the presence collection
  presenceRef.onSnapshot(async (snapshot) => {
    const currentlyOnline = await Promise.all(allRoomNames.map(async (streamName) => {
      const lastValidTimestamp = Date.now() - PRESENCE_LENGTH;
      let q = presenceRef.where("room_id", "==", streamName).where("timestamp", ">=", lastValidTimestamp);
      const querySnapshot = await q.get();
      let numResults = querySnapshot.size;
      return {roomID: streamName, numOnline: numResults}
    }));
    // Calculate the total number of people online across all rooms
    const totalOnline = currentlyOnline.reduce((sum, { numOnline }) => sum + numOnline, 0);
    
    // Update a separate document in Firestore with the total online count
    await Promise.all(currentlyOnline.map(({roomID, numOnline}) => 
      roomID !== "home" &&roomDoc(roomID).set({num_online: numOnline}, {merge: true})
    ));
    await firestore.collection("stats").doc("total_online").set({ total: totalOnline }, { merge: true });
  });
}

async function cleanupOldPresence(allRoomNames: string[]) {
  const presenceRef = firestore.collection("presence");
  const lastValidTimestamp = Date.now() - PRESENCE_LENGTH;
  let q = presenceRef.where("timestamp", "<=", lastValidTimestamp);
  const querySnapshot = await q.get();
  querySnapshot.forEach((doc) => {
    doc.ref.delete();
  });
  setTimeout(() => cleanupOldPresence(allRoomNames), PRESENCE_CLEANUP_FREQUENCY);
}

async function setTransaction(id: string, status: string) {
  await firestore.collection("energy_transactions").doc(id).set({status: status}, {merge: true});
}

export async function presenceProcessor() {
  let collectionRef = firestore.collection("rooms");
  let docs = await collectionRef.listDocuments();
  let docNames: string[] = ["home"];
  docs.forEach((d) => docNames.push(d.id));
  setupPresenceListener(docNames);
  cleanupOldPresence(docNames);
}

