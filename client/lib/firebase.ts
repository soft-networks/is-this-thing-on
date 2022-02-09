// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase , ref, onValue, off} from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEELIQs6LfHdFCnqUUNluk7tXKodeHIwE",
  authDomain: "is-this-thing-on-320a7.firebaseapp.com",
  databaseURL: "https://is-this-thing-on-320a7-default-rtdb.firebaseio.com",
  projectId: "is-this-thing-on-320a7",
  storageBucket: "is-this-thing-on-320a7.appspot.com",
  messagingSenderId: "895037288643",
  appId: "1:895037288643:web:4da7f037a77603eac6b276"
};

const DB_ROOT = "streamKeys"

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const DEFAULT_STREAM_STATUS = "un-initialized";

// Create function to sync stream state from DB with Firebase v9
export const syncStreamStatus = (streamName: string, setActiveCallback: ( streamStatus: string) => void) => { 
  const streamStatusRef = ref(db, `${DB_ROOT}/${streamName}/status`);
  
  onValue(streamStatusRef, (snapshot) => {
    let val = snapshot.val()
    if (val) {
      setActiveCallback(val);
    } else {
      setActiveCallback(DEFAULT_STREAM_STATUS);
    }
  });
}

//Create function to sync stream playbackID from DB with Firebase v9
export const syncStreamPlaybackID = (streamName: string, setPlaybackIDCallback: ( playbackID: string) => void) => {
  const streamPlaybackIDRef = ref(db, `${DB_ROOT}/${streamName}/playbackID`);
  onValue(streamPlaybackIDRef, (snapshot) => {
    let val = snapshot.val()
    if (val) {
        setPlaybackIDCallback(val);
    } 
  });
}

export const disableStreamSync = (streamname: string) => { 
  const streamStatusRef = ref(db, `${DB_ROOT}/${streamname}/status`);
  const streamPlaybackIDRef = ref(db, `${DB_ROOT}/${streamname}/playbackID`);

  //Turn off stream status sync
  off(streamStatusRef);
  off(streamPlaybackIDRef);
}