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
import { logFirebaseUpdate } from "../logger";

export async function syncRoomInfoDB(
  roomName: string,
  callback: (roomInfo: CurrentRoomInfo) => void,
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

  let roomInfo: CurrentRoomInfo[] = [];
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

export async function syncAllRoomsSummary(
  initRing: (ring: AllRoomsSummary) => void,
  linkUpdate: (roomName: string, update: RoomSummary) => void,
  onRoomCreatedOrDestroyed: (roomName: string, update: "created" | "destroyed", roomInfo: RoomSummary) => void,
) {
  const unsubUpdates: Unsubscribe[] = [];
  const ring: AllRoomsSummary = {};
  let collectionRef = roomsCollection();

  // Single listener for all document changes
  const unsubRoomChanges = onSnapshot(
    query(collectionRef, where("hidden", "!=", true)),
    {includeMetadataChanges: true},
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const roomInfo = sanitizeRoomInfo(change.doc.data(), change.doc.id);
        if (change.type === "added") {
          logFirebaseUpdate(`Room ${change.doc.id} created`, [roomInfo]);
          onRoomCreatedOrDestroyed(change.doc.id, "created", roomInfo);
          ring[change.doc.id] = roomInfo;
        }
        else if (change.type === "removed") {
          onRoomCreatedOrDestroyed(change.doc.id, "destroyed", roomInfo);
          delete ring[change.doc.id];
        }
        else if (change.type === "modified") {
            ring[change.doc.id] = roomInfo;
            linkUpdate(change.doc.id, roomInfo);
        }
      });
    }
  );
  unsubUpdates.push(unsubRoomChanges);
  return unsubUpdates;
}