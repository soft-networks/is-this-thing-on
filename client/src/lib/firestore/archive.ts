import { collection, doc, onSnapshot, query, updateDoc } from "firebase/firestore";
import { archiveDoc, archiveRoomsCollection } from "./locations";
import db from "./init";

/**
 * Sync all archives from Firestore (for listing).
 */
export function syncAllArchives(
  callback: (archives: ArchiveInfo[]) => void,
) {
  return onSnapshot(query(collection(db, "archives")), (snapshot) => {
    const archives: ArchiveInfo[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      archives.push({
        archiveID: doc.id,
        name: data.name || "",
        description: data.description || "",
      });
    });
    callback(archives);
  });
}

/**
 * Sync archive info from Firestore.
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
      moreURL: data.more_url || undefined,
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
  return onSnapshot(query(archiveRoomsCollection(archiveID)), { includeMetadataChanges: false }, (snapshot) => {
    const rooms: AllArchiveRooms = {};
    snapshot.forEach((doc) => {
      const data = doc.data();
      rooms[doc.id] = {
        roomID: doc.id,
        roomName: data.room_name || "",
        roomColor: data.room_color || "#FCFF54",
        archiveURL: data.archive_url || "",
        chatDisabled: data.chat_disabled || false,
        admins: data.admins || [],
      };
    });
    callback(rooms);
  });
}

export function setArchiveRoomChatDisabled(archiveID: string, roomID: string, disabled: boolean) {
  const roomRef = doc(archiveRoomsCollection(archiveID), roomID);
  return updateDoc(roomRef, { chat_disabled: disabled });
}
