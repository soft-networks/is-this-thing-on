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
    let data = doc.data();
    data && callback(sanitizeRoomInfo(data, doc.id));
  });
  return unsub;
}

export async function getRoomsWhereUserISAdmin(userID: string) {
  const q = query(
    roomsCollection(),
    where("admins", "array-contains", userID),
    where("hidden", "!=", true),
  );
  const querySnapshot = await getDocs(q);
  let numResults = querySnapshot.size;

  if (numResults == 0) {
    return undefined;
  }

  let roomInfo: RoomInfo[] = [];
  querySnapshot.forEach((doc) =>
    roomInfo.push(sanitizeRoomInfo(doc.data(), doc.id)),
  );
  return roomInfo;
}
export async function getRoomAdmins(roomID: string) {
  let roomRef = roomDoc(roomID);
  let roomDocument = await getDoc(roomRef);
  let data = roomDocument.data();
  return data && data["admins"] ? data["admins"] : [];
}

export async function syncWebRing(
  initRing: (ring: WebRing) => void,
  linkUpdate: (roomName: string, update: RoomLinkInfo) => void,
) {
  let collectionRef = roomsCollection();
  let docs = await getDocs(query(collectionRef, where("hidden", "!=", true)));
  console.log(docs);
  const unsubUpdates: Unsubscribe[] = [];
  const ring: WebRing = {};

  docs.forEach((doc) => {
    let data = sanitizeRoomInfo(doc.data(), doc.id);

    ring[doc.id] = {
      roomID: data.roomID,
      roomName: data.roomName,
      roomColor: "white",
      streamStatus: "disconnected",
      consentURL: data.consentURL,
    };
    let unsub = onSnapshot(doc.ref, (doc) => {
      let data = doc.data();
      if (data && doc.id) {
        let sanitized = sanitizeRoomInfo(data, doc.id);
        linkUpdate(doc.id, sanitized);
      }
    });
    unsubUpdates.push(unsub);
  });
  initRing(ring);
  return unsubUpdates;
}
