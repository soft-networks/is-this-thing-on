import {
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

import { logFirebaseUpdate } from "../logger";
import { trace } from "../tracers";
import {
  sanitizeStickerCDNFromDB,
  sanitizeStickerInstanceForDB,
  sanitizeStickerInstanceFromDB,
  validateRoomName,
} from "./converters";
import { MollyAssetsJson } from "./custom/mollyAssets";
import { MollyDeleteAssets } from "./custom/mollyAssetsDeleteOnly";
import {
  roomDoc,
  stickerCDNCollection,
  stickerInstanceCollection,
  stickerInstanceDoc,
} from "./locations";

export async function getStickerCDN(
  roomName: string,
  initStickerCDN: (cdn: { [key: string]: Sticker }) => void,
) {
  if (!validateRoomName(roomName)) {
    return;
  }
  const dbStickerCDN = stickerCDNCollection(roomDoc(roomName));
  const querySnapshot = await getDocs(dbStickerCDN);
  const cdn: { [key: string]: Sticker } = {};
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    const sticker = sanitizeStickerCDNFromDB(doc.data(), doc.id);
    cdn[doc.id] = sticker;
  });

  logFirebaseUpdate(`Sticker CDN for ${roomName} established`, [cdn]);
  initStickerCDN(cdn);
}

export function syncStickerInstances(
  roomName: string,
  setServerSideStickerInstances: React.Dispatch<
    React.SetStateAction<{ [key: string]: StickerInstance }>
  >,
) {
  if (!validateRoomName(roomName)) {
    return;
  }
  const dbStickers = stickerInstanceCollection(roomDoc(roomName));
  // const q = query(elements, where("behavior_type", "==", behaviorType));

  const unsub = onSnapshot(dbStickers, (docs) => {
    trace("sync-stickers", () => {
      setServerSideStickerInstances((pc) => {
        let npc = { ...pc };
        docs.docChanges().forEach((change) => {
          let element = change.doc;
          if (change.type === "added") {
            logFirebaseUpdate("StickerInstance Added");
            const sanitizedStickerInstance = sanitizeStickerInstanceFromDB(
              change.doc.data(),
            );
            npc[element.id] = sanitizedStickerInstance;
          }
          if (change.type === "modified") {
            logFirebaseUpdate(`StickerInstance updated for ID ${element.id}`);
            let stickerData = element.data();
            if (stickerData.position) {
              npc[element.id].position = stickerData.position;
              npc[element.id].size = stickerData.size;
              npc[element.id].zIndex = stickerData.zIndex;
            }
          }
          if (change.type === "removed") {
            logFirebaseUpdate("StickerInstance removed");
            delete npc[element.id];
          }
        });
        return npc;
      });
    });
  });
  return unsub;
}

export async function addStickerInstance(
  roomName: string,
  element: StickerInstance,
) {
  trace("add-sticker", () => {
    const stickerInstances = stickerInstanceCollection(roomDoc(roomName));
    return addDoc(stickerInstances, sanitizeStickerInstanceForDB(element));
  });
}

export async function updateStickerInstancePos(
  roomName: string,
  stickerID: string,
  pos: Pos,
) {
  if (pos[0] <= -0.5 || pos[1] <= -0.5 || pos[0] >= 1.5 || pos[1] >= 1.5) {
    return;
  }

  trace("update-sticker-pos", () => {
    const stickerInstances = stickerInstanceCollection(roomDoc(roomName));
    const stickerInstance = stickerInstanceDoc(stickerInstances, stickerID);
    return setDoc(stickerInstance, { position: pos }, { merge: true });
  });
}
export async function updateStickerInstanceScale(
  roomName: string,
  stickerID: string,
  size: number,
) {
  trace("update-sticker-scale", () => {
    const stickerInstances = stickerInstanceCollection(roomDoc(roomName));
    const stickerInstance = stickerInstanceDoc(stickerInstances, stickerID);
    return setDoc(stickerInstance, { size: size }, { merge: true });
  });
}
export async function updateStickerInstanceZIndex(
  roomName: string,
  stickerID: string,
  zIndex: number,
) {
  trace("update-sticker-z-index", () => {
    const stickerInstances = stickerInstanceCollection(roomDoc(roomName));
    const stickerInstance = stickerInstanceDoc(stickerInstances, stickerID);
    return setDoc(stickerInstance, { zIndex: zIndex }, { merge: true });
  });
}
export async function deleteStickerInstance(
  roomName: string,
  stickerID: string,
) {
  trace("delete-sticker", async () => {
    const stickerInstances = stickerInstanceCollection(roomDoc(roomName));
    const stickerInstance = stickerInstanceDoc(stickerInstances, stickerID);
    return deleteDoc(stickerInstance);
  });
}

export async function resetStickers(roomName: string) {
  logFirebaseUpdate("About to reset stickers for " + roomName);  const stickerInstances = stickerInstanceCollection(roomDoc(roomName));
  console.log(stickerInstances.path);
  const querySnapshot = await getDocs(stickerInstances);
  console.log(querySnapshot.empty);
  querySnapshot.forEach((doc) => {
    logFirebaseUpdate("Deleting sticker instance");
    deleteDoc(doc.ref);
  });
}

///PLEASE DONT JUDGE ME FOR THIS  :)

export async function populateGlobalStickerCDN() {
  
  const stickerCDN = {
    "dolphins": {
      url: "https://storage.googleapis.com/is-this-thing-on/globalstickers/474216_d8a17.gif"
    }, 
    "rainbow": {
      url: "https://storage.googleapis.com/is-this-thing-on/globalstickers/tumblr_o22cvpElFs1v69vbyo1_75sq.gif"
    }, "rose": {
      url: "https://storage.googleapis.com/is-this-thing-on/globalstickers/picgifs-roses-0131147.gif"
    }, "slug": {
      url: "https://storage.googleapis.com/is-this-thing-on/globalstickers/tumblr_o9tu2tkTum1uajvwdo1_250.gif"
    }, "spider": {
      url: "https://storage.googleapis.com/is-this-thing-on/globalstickers/379725_e2954.gif"
    }, "stars": {
      url: "https://storage.googleapis.com/is-this-thing-on/globalstickers/5622cce2067d7b6891fca6e7.gif",
    }, "sun": {
      url: "https://storage.googleapis.com/is-this-thing-on/globalstickers/tumblr_oukm0aPJDg1wpgn2yo1_100.gif", 
    }, "tomato": {
      url: "https://storage.googleapis.com/is-this-thing-on/globalstickers/1657288194_48282_gif-url.gif"
    }
  }
  // Now copy this CDN into the rooms: molly, chrisy and soft
  const rooms = ["soft"];
  for (const room of rooms) {
    const roomDocRef = roomDoc(room);
    const dbStickerCDN = stickerCDNCollection(roomDocRef);
    //write sticker cdn to the room 
    for (const [key, value] of Object.entries(stickerCDN)) {
      const assetDoc = doc(dbStickerCDN, key);
      setDoc(assetDoc, value);
    }
  }
}
export async function populateHerdimasCDN() {
  //Delete all CDN stickers for herdimas
  const stickerCDN = stickerCDNCollection(roomDoc("compromised"));
  const querySnapshotCDN = await getDocs(stickerCDN);
  querySnapshotCDN.forEach((doc) => {
    deleteDoc(doc.ref);
  });

  const roomDocRef = roomDoc("compromised");
  const dbStickerCDN = stickerCDNCollection(roomDocRef);

  for (let i = 1; i < 33; i++) {
    let assetDoc = doc(dbStickerCDN, i.toString());
    setDoc(assetDoc, {
      url: `https://storage.googleapis.com/is-this-thing-on/compromised/${i}.png`,
    });
  }
}

export function populateMollyCDN() {
  const roomDocRef = roomDoc("molly");
  const dbStickerCDN = stickerCDNCollection(roomDocRef);

  for (let i = 0; i < MollyAssetsJson.length; i++) {
    let asset = MollyAssetsJson[i];
    let id = asset.id;

    let assetDoc = doc(dbStickerCDN, id);
    setDoc(assetDoc, {
      url: asset.url,
      type: asset.type,
      noGift: asset.noGift || false,
    });
  }
}

export async function populateMollyAllInstances() {
  for (let i = 0; i < MollyAssetsJson.length; i++) {
    let asset = MollyAssetsJson[i];
    let id = asset.id;

    const stickerInstances = stickerInstanceCollection(roomDoc("molly"));
    await addDoc(stickerInstances, {
      cdn_id: id,
      position: [asset.position.x, asset.position.y],
      timestamp: Date.now(),
      zIndex: asset.zIndex,
      size: asset.size,
    });
  }
}

export async function repopulateOnlyDeletedAssetsMolly() {
  for (let i = 0; i < MollyDeleteAssets.length; i++) {
    let asset = MollyDeleteAssets[i];
    let id = asset.id;

    const stickerInstances = stickerInstanceCollection(roomDoc("molly"));
    await addDoc(stickerInstances, {
      cdn_id: id,
      position: [asset.position.x, asset.position.y],
      timestamp: Date.now(),
      zIndex: asset.zIndex,
      size: asset.size,
    });
  }
}
