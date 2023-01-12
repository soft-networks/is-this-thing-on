import { addDoc, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, setDoc, where } from "firebase/firestore";
import {
  sanitizeStickerCDNFromDB,
  sanitizeStickerInstanceForDB,
  sanitizeStickerInstanceFromDB,
  validateRoomName,
} from "./converters";
import { stickerInstanceCollection, roomDoc, stickerCDNCollection, stickerInstanceDoc } from "./locations";
import { MollyAssetsJson } from "./mollyAssets";
import { MollyDeleteAssets } from "./mollyAssetsDeleteOnly";

export async function getStickerCDN(roomName: string, initStickerCDN: (cdn: { [key: string]: Sticker }) => void) {
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

  initStickerCDN(cdn);
}

export function syncStickerInstances(
  roomName: string,
  stickerAdded: (id: string, element: StickerInstance) => void,
  stickerRemoved: (id: string) => void,
  stickerPosUpdated: (id: string, pos: Pos, size: number, zIndex: number) => void
) {
  if (!validateRoomName(roomName)) {
    return;
  }
  const dbStickers = stickerInstanceCollection(roomDoc(roomName));
  // const q = query(elements, where("behavior_type", "==", behaviorType));

  const unsub = onSnapshot(dbStickers, (docs) => {
    docs.docChanges().forEach((change) => {
      let element = change.doc;
      if (change.type === "added") {
        const sanitizedStickerInstance = sanitizeStickerInstanceFromDB(change.doc.data());
        stickerAdded(element.id, sanitizedStickerInstance);
      }
      if (change.type === "modified") {
        let stickerData = element.data();
        if (stickerData.position) {
          stickerPosUpdated(element.id, stickerData.position, stickerData.size, stickerData.zIndex);
        }
      }
      if (change.type === "removed") {
        stickerRemoved(element.id);
      }
    });
  });
  return unsub;
}

export async function addStickerInstance(roomName: string, element: StickerInstance) {
  const stickerInstances = stickerInstanceCollection(roomDoc(roomName));
  await addDoc(stickerInstances, sanitizeStickerInstanceForDB(element));
}

export async function updateStickerInstancePos(roomName: string, stickerID: string, pos: Pos) {
  const stickerInstances = stickerInstanceCollection(roomDoc(roomName));
  const stickerInstance = stickerInstanceDoc(stickerInstances, stickerID);

  setDoc(stickerInstance, { position: pos }, { merge: true });
}
export async function updateStickerInstanceScale(roomName: string, stickerID: string, size: number) {
  const stickerInstances = stickerInstanceCollection(roomDoc(roomName));
  const stickerInstance = stickerInstanceDoc(stickerInstances, stickerID);
  setDoc(stickerInstance, { size: size }, { merge: true });
}
export async function updateStickerInstanceZIndex(roomName: string, stickerID: string, zIndex: number) {
  const stickerInstances = stickerInstanceCollection(roomDoc(roomName));
  const stickerInstance = stickerInstanceDoc(stickerInstances, stickerID);
  setDoc(stickerInstance, { zIndex: zIndex }, { merge: true });
}
export async function deleteStickerInstance(roomName: string, stickerID: string) {
  const stickerInstances = stickerInstanceCollection(roomDoc(roomName));
  const stickerInstance = stickerInstanceDoc(stickerInstances, stickerID);

  deleteDoc(stickerInstance);
}

///PLEASE DONT JUDGE ME FOR THIS  :)



export function bhavikShouldNeverCodeAgain() {
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

export async function butWeMayAsWellDoItAll() {
  for (let i = 0; i < MollyAssetsJson.length; i++) {
    let asset = MollyAssetsJson[i];
    let id = asset.id;

    const stickerInstances = stickerInstanceCollection(roomDoc("molly"));
    await addDoc(stickerInstances, {
      cdn_id: id,
      position: [asset.position.x, asset.position.y],
      timestamp: Date.now(),
      zIndex: asset.zIndex,
      size: asset.size
    });

  }}

  export async function repopulateMollyDeletedAssets(){
    for (let i = 0; i < MollyDeleteAssets.length; i++) {
      let asset = MollyDeleteAssets[i];
      let id = asset.id;
  
      const stickerInstances = stickerInstanceCollection(roomDoc("molly"));
      await addDoc(stickerInstances, {
        cdn_id: id,
        position: [asset.position.x, asset.position.y],
        timestamp: Date.now(),
        zIndex: asset.zIndex,
        size: asset.size
      });
    }}

