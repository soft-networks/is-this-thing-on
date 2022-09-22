import { addDoc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { sanitizeStickerCDNFromDB, sanitizeStickerInstanceForDB, sanitizeStickerInstanceFromDB, validateRoomName } from "./converters";
import { stickerInstanceCollection, roomDoc, stickerCDNCollection } from "./locations";


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
  stickerRemoved: (id: string) => void
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
      }
      if (change.type === "removed") {
        stickerRemoved(element.id);
      }
    });
  });
  return unsub;
}

export async function addStickerInstance(roomName: string, element: StickerInstance) {
  const chats = stickerInstanceCollection(roomDoc(roomName));
  await addDoc(chats, sanitizeStickerInstanceForDB(element));
}
