import { onSnapshot, query } from "firebase/firestore";
import { archiveDoc, archiveRoomsCollection } from "./locations";

/**
 * Sync archive info from Firestore. Stub for v0 — not wired up yet.
 */
export function syncArchiveInfo(
  archiveID: string,
  callback: (info: ArchiveInfo | null) => void,
) {
  return onSnapshot(archiveDoc(archiveID), (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }
    const data = snapshot.data();
    callback({
      archiveID: snapshot.id,
      name: data.name || "",
      description: data.description || "",
    });
  });
}

/**
 * Sync archive rooms from Firestore. Stub for v0 — not wired up yet.
 */
export function syncArchiveRooms(
  archiveID: string,
  callback: (rooms: AllArchiveRooms) => void,
) {
  return onSnapshot(query(archiveRoomsCollection(archiveID)), (snapshot) => {
    const rooms: AllArchiveRooms = {};
    snapshot.forEach((doc) => {
      const data = doc.data();
      rooms[doc.id] = {
        roomID: doc.id,
        roomName: data.room_name || "",
        roomColor: data.room_color || "#FCFF54",
        archiveURL: data.archive_url || "",
      };
    });
    callback(rooms);
  });
}
