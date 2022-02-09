import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, off, set } from "firebase/database";
import { MagicPiece } from "../components/magicPieces";
import { MAGIC_PIECE_TEST_STUBS } from "./testingStubs";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEELIQs6LfHdFCnqUUNluk7tXKodeHIwE",
  authDomain: "is-this-thing-on-320a7.firebaseapp.com",
  databaseURL: "https://is-this-thing-on-320a7-default-rtdb.firebaseio.com",
  projectId: "is-this-thing-on-320a7",
  storageBucket: "is-this-thing-on-320a7.appspot.com",
  messagingSenderId: "895037288643",
  appId: "1:895037288643:web:4da7f037a77603eac6b276",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Constants
const DB_ROOT = "streamKeys";
const DEFAULT_STREAM_STATUS = "un-initialized";
const USE_TESTING_STUBS = false;

// Create function to sync stream state from DB with Firebase v9
export const syncStreamStatus = (streamName: string, setActiveCallback: (streamStatus: string) => void) => {
  const streamStatusRef = ref(db, `${DB_ROOT}/${streamName}/status`);

  onValue(streamStatusRef, (snapshot) => {
    let val = snapshot.val();
    if (val) {
      setActiveCallback(val);
    } else {
      setActiveCallback(DEFAULT_STREAM_STATUS);
    }
  });
};

//Create function to sync stream playbackID from DB with Firebase v9
export const syncStreamPlaybackID = (streamName: string, setPlaybackIDCallback: (playbackID: string) => void) => {
  const streamPlaybackIDRef = ref(db, `${DB_ROOT}/${streamName}/playbackID`);
  onValue(streamPlaybackIDRef, (snapshot) => {
    let val = snapshot.val();
    if (val) {
      setPlaybackIDCallback(val);
    }
  });
};

export const disableStreamSync = (streamname: string) => {
  const streamStatusRef = ref(db, `${DB_ROOT}/${streamname}/status`);
  const streamPlaybackIDRef = ref(db, `${DB_ROOT}/${streamname}/playbackID`);

  //Turn off stream status sync
  off(streamStatusRef);
  off(streamPlaybackIDRef);
};

export const syncMagicPieces = (streamname: string, setMagicPiecesCallback: (piece: MagicPiece[]) => void) => {
  if (USE_TESTING_STUBS) {
    setMagicPiecesCallback(MAGIC_PIECE_TEST_STUBS);
    return;
  }
  const magicPiecesRef = ref(db, `${DB_ROOT}/${streamname}/magicPieces`);
  onValue(magicPiecesRef, (snapshot) => {
    let val = snapshot.val();
    let pieces : MagicPiece[] = [];
    if (val) {
      const pieceDict = val;
      Object.keys(pieceDict).forEach((key) => {
        pieces.push({ ...pieceDict[key], id: key });
      })
    }     
    setMagicPiecesCallback(pieces);

  });
};

export const updateMagicPiecePos = (streamname: string, pieceID: string, nx: number, ny: number) => {
  const magicPiecesRef = ref(db, `${DB_ROOT}/${streamname}/magicPieces/${pieceID}/pos`);
  set(magicPiecesRef, {
    x: nx,
    y: ny
  });
}

export const disableMagicPiecesSync = (streamname: string) => { 
  const magicPiecesRef = ref(db, `${DB_ROOT}/${streamname}/magicPieces`);
  off(magicPiecesRef);
}