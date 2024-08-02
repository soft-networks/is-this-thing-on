import {
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import {
  roomDoc,
  stickerCDNCollection,
  stickerInstanceCollection,
  stickerInstanceDoc,
} from "./locations";
import {
  sanitizeStickerCDNFromDB,
  sanitizeStickerInstanceForDB,
  sanitizeStickerInstanceFromDB,
  validateRoomName,
} from "./converters";

import { MollyAssetsJson } from "./custom/mollyAssets";
import { MollyDeleteAssets } from "./custom/mollyAssetsDeleteOnly";
import { logFirebaseUpdate } from "../logger";
import { trace } from "../tracers";

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
  stickerAdded: (id: string, element: StickerInstance) => void,
  stickerRemoved: (id: string) => void,
  stickerPosUpdated: (
    id: string,
    pos: Pos,
    size: number,
    zIndex: number,
  ) => void,
) {
  if (!validateRoomName(roomName)) {
    return;
  }
  const dbStickers = stickerInstanceCollection(roomDoc(roomName));
  // const q = query(elements, where("behavior_type", "==", behaviorType));

  const unsub = onSnapshot(dbStickers, (docs) => {
    trace("sync-stickers", () => {
      docs.docChanges().forEach((change) => {
        let element = change.doc;
        if (change.type === "added") {
          const sanitizedStickerInstance = sanitizeStickerInstanceFromDB(
            change.doc.data(),
          );
          stickerAdded(element.id, sanitizedStickerInstance);
        }
        if (change.type === "modified") {
          let stickerData = element.data();
          if (stickerData.position) {
            stickerPosUpdated(
              element.id,
              stickerData.position,
              stickerData.size,
              stickerData.zIndex,
            );
          }
        }
        if (change.type === "removed") {
          stickerRemoved(element.id);
        }
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
  logFirebaseUpdate("About to reset stickers for " + roomName);
  if (roomName == "chrisy") {
    logFirebaseUpdate("Chrisy is not allowed to reset stickers");
    return;
  }

  if (roomName == "compromised") {
    populateHerdimasCDN();
  }
  const stickerInstances = stickerInstanceCollection(roomDoc(roomName));
  console.log(stickerInstances.path);
  //const stickerInstances = st
  const querySnapshot = await getDocs(stickerInstances);

  console.log(querySnapshot.empty);
  querySnapshot.forEach((doc) => {
    console.log("HELLO");
    logFirebaseUpdate("Deleting sticker instance");
    deleteDoc(doc.ref);
  });
  if (roomName == "molly") {
    populateMollyAllInstances();
  }
}

///PLEASE DONT JUDGE ME FOR THIS  :)

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
