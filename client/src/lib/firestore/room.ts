import { getDoc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { sanitizeRoomInfo, validateRoomName } from "./converters";
import { roomDoc, roomsCollection } from "./locations";

export async function syncRoomInfoDB(roomName: string, callback: (roomInfo: RoomInfo) => void) {
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
  const q = query(roomsCollection(), where("admins", "array-contains", userID));
  const querySnapshot = await getDocs(q);
  let numResults = querySnapshot.size;

  if (numResults == 0) {
    return undefined;
  }

  let roomInfo : RoomInfo[] = [];
  querySnapshot.forEach((doc) => roomInfo.push(sanitizeRoomInfo(doc.data(), doc.id)));
  return roomInfo;
}
export async function getRoomAdmins(roomID: string) {
  let roomRef = roomDoc(roomID);
  let roomDocument = await getDoc(roomRef);
  let data = roomDocument.data();
  return data && data["admins"] ? data["admins"] : [];
}