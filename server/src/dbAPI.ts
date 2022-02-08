
import { initializeApp } from 'firebase/app';
import { getDatabase , ref, get, set} from "firebase/database";

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
const db = getDatabase(app);
const DB_ROOT = "streamKeys"

export const getStreamKey = async (streamName: string) => {
  const snapshot = await get(ref(db, DB_ROOT + "/" + streamName));
  if (snapshot.exists()) {
    return snapshot.val()['key']
  } else {
    return undefined;
  }
}

const getStreamRoot = (streamName: string) => {
 return DB_ROOT + "/" + streamName;
}
export const writeStreamKeyToDB = async (streamName: string, streamKey: string) => {
  const streamKeyRef = ref(db, getStreamRoot(streamName) + "/key");
  set(streamKeyRef, streamKey);
}

export const writeStreamStateToDB = async (streamName: string, streamStatus: string) => {
  const streamStatusRef = ref(db, getStreamRoot(streamName) + "/status");
  set(streamStatusRef, streamStatus);
}

export const writePlaybackIDToDB = async (streamName: string, playbackID: string) => {
  const playbackIDRef = ref(db, getStreamRoot(streamName) + "/playbackID");
  set(playbackIDRef, playbackID);
}

// export const writeAssetIDToDB = async (streamName: string, assetID: string) => {
//   const assetIDRef = ref(db, getStreamRoot(streamName) + "/asset");
//   set(assetIDRef, assetID);
// }