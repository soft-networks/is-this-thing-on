
import { getDatabase, ref, onValue, off, set } from "firebase/database";
import { app } from "./firebase-init";
import { MAGIC_PIECE_TEST_STUBS } from "./testingStubs";

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


const USER_ROOT = "users";

export const syncUser = (username: string, setRewards: (userRewards: number) => void) => {
  const usernameref = ref(db, `${USER_ROOT}/${username}`);
  onValue(usernameref, (snapshot) => {
    console.log("received user snapshot", snapshot.exists());
    //Create user now..
    if (!snapshot.exists()) {
      updateUserRewards(username, 0);
    }
    else if (snapshot.val() !== undefined) 
      setRewards(snapshot.val());
  });
}
export const disableUserSync = (username: string) => {
  const usernameref = ref(db, `${USER_ROOT}/${username}`);
  off(usernameref);
}

export const updateUserRewards = (username: string, newRewards: number) => {
  const usernameref = ref(db, `${USER_ROOT}/${username}`);
  set(usernameref, newRewards);
}

export const syncAllUsers = (setUserList : ( userList: {[key:string]: number}) => void) => {
  const userListRef = ref(db, `${USER_ROOT}`);
  onValue(userListRef, (snapshot) => {
    if (snapshot.val() !== undefined) 
      setUserList(snapshot.val());
  });
}

export const disableAllUserSync = () => {
  const userListRef = ref(db, `${USER_ROOT}`);
  off(userListRef);
}