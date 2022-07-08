
import { initializeApp } from 'firebase/app';
import { getDatabase , ref, get, set} from "firebase/database";
import { doc, documentId, getDoc, getFirestore, setDoc} from "firebase/firestore";
import { logError, logInfo, logUpdate } from './logger.js';

const firebaseConfig = {
  apiKey: "AIzaSyDEELIQs6LfHdFCnqUUNluk7tXKodeHIwE",
  authDomain: "is-this-thing-on-320a7.firebaseapp.com",
  databaseURL: "https://is-this-thing-on-320a7-default-rtdb.firebaseio.com",
  projectId: "is-this-thing-on-320a7",
  storageBucket: "is-this-thing-on-320a7.appspot.com",
  messagingSenderId: "895037288643",
  appId: "1:895037288643:web:77cdcfd1981d449fc6b276"
};
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const db = getDatabase(app);
const KEY_ROOT = "streamKeys"
const ID_ROOT = "muxIDs"


/**
 * gets all room data from firestore 
 * @param roomName 
 * @returns dictionary of room data 
 * @throws Error if room doesnt exist
 */
const getRoom = async (roomName: string) => {
  const roomRef = doc(firestore, "rooms", roomName);
  const room = await getDoc(roomRef);

  if (room.exists()) {
    return room.data();
  } else {
    throw Error(`Room ${room} doesn't exist`);
  }
}

/**
 * gets stream key from firestore, given a room name. 
 * @param roomName 
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
  let docRef = await setDoc(doc(firestore, "rooms", roomID), {stream_key: streamKey}, {merge: true});
}

const getStreamRoot = (streamName: string) => {
 return KEY_ROOT + "/" + streamName;
}
const getMuxIDRoot = (streamID: string) => {
  return ID_ROOT + "/" + streamID;
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
  let docRef = await setDoc(doc(firestore, "rooms", roomID), {stream_status: streamStatus}, {merge: true});

}

export const writePlaybackIDToDB = async (roomID: string, playbackID: string) => {
  let docRef = await setDoc(doc(firestore, "rooms", roomID), {stream_playback_id:  playbackID}, {merge: true});
}

// export const writeAssetIDToDB = async (streamName: string, assetID: string) => {
//   const assetIDRef = ref(db, getStreamRoot(streamName) + "/asset");
//   set(assetIDRef, assetID);
// }