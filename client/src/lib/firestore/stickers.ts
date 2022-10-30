import { addDoc, deleteDoc, getDoc, getDocs, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { sanitizeStickerCDNFromDB, sanitizeStickerInstanceForDB, sanitizeStickerInstanceFromDB, validateRoomName } from "./converters";
import { stickerInstanceCollection, roomDoc, stickerCDNCollection, stickerInstanceDoc } from "./locations";


export async function getStickerCDN(roomName: string, initStickerCDN: (cdn: {[key:string]: Sticker}) => void) {
  if (!validateRoomName(roomName)){
    return;
  }
  const dbStickerCDN = stickerCDNCollection(roomDoc(roomName));
  const querySnapshot = await getDocs(dbStickerCDN);
  const cdn : {[key:string]: Sticker} = {}
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
  stickerPosUpdated: (id: string, pos: Pos) => void
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
        const sanitizedStickerInstance =  sanitizeStickerInstanceFromDB(change.doc.data());
        stickerAdded(element.id, sanitizedStickerInstance);
      }
      if (change.type === "modified") {
        let stickerData = element.data();
        if (stickerData.position) {
          stickerPosUpdated(element.id, stickerData.position);
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

  setDoc(stickerInstance, {position: pos}, {merge: true});
}

export async function deleteStickerInstance(roomName: string, stickerID: string) {
  const stickerInstances = stickerInstanceCollection(roomDoc(roomName));
  const stickerInstance = stickerInstanceDoc(stickerInstances, stickerID);

  deleteDoc(stickerInstance);

}