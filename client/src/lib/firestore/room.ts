import {
  getDoc,
  getDocs,
  onSnapshot,
  query,
  Unsubscribe,
  where,
} from "firebase/firestore";
import { sanitizeRoomInfo, validateRoomName } from "./converters";
import { roomDoc, roomsCollection } from "./locations";

export async function syncRoomInfoDB(
  roomName: string,
  callback: (roomInfo: RoomInfo) => void,
) {
  if (!validateRoomName(roomName)) {
    return;
  }
  const unsub = onSnapshot(roomDoc(roomName), (doc) => {
    const data = doc.data();
    data && callback(sanitizeRoomInfo(data, doc.id));
  });
  return unsub;
}

export async function getRoomsWhereUserISAdmin(userID: string) {
  const q = query(roomsCollection(), where("admins", "array-contains", userID));
  const querySnapshot = await getDocs(q);
  const numResults = querySnapshot.size;

  if (numResults == 0) {
    return undefined;
  }

  const roomInfo: RoomInfo[] = [];
  querySnapshot.forEach((doc) =>
    roomInfo.push(sanitizeRoomInfo(doc.data(), doc.id)),
  );
  return roomInfo;
}
export async function getRoomAdmins(roomID: string) {
  const roomRef = roomDoc(roomID);
  const roomDocument = await getDoc(roomRef);
  const data = roomDocument.data();
  return data && data["admins"] ? data["admins"] : [];
}

export async function syncWebRing(
  initRing: (ring: WebRing) => void,
  linkUpdate: (roomName: string, update: RoomLinkInfo) => void,
) {
  const collectionRef = roomsCollection();
  const docs = await getDocs(collectionRef);
  const unsubUpdates: Unsubscribe[] = [];
  const ring: WebRing = {};

  docs.forEach((doc) => {
    const data = sanitizeRoomInfo(doc.data(), doc.id);

    ring[doc.id] = {
      roomID: data.roomID,
      roomName: data.roomName,
      roomColor: "white",
      streamStatus: "disconnected",
      consentURL: data.consentURL,
    };
    const unsub = onSnapshot(doc.ref, (doc) => {
      const data = doc.data();
      if (data && doc.id) {
        const sanitized = sanitizeRoomInfo(data, doc.id);
        linkUpdate(doc.id, sanitized);
      }
    });
    unsubUpdates.push(unsub);
  });
  initRing(ring);
  return unsubUpdates;
}
