import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { roomDoc } from "./firestore/locations";

export function onArchiveURLUpdate(
  roomID: string,
  onArchiveURLDidUpdate: (archiveURL: string | null) => void
) {
  const roomReference = roomDoc(roomID);

  return onSnapshot(roomReference, (snapshot) => {
    const data = snapshot.data();
    onArchiveURLDidUpdate(data?.archive_url || null);
  });
}

export async function setArchiveURL(roomID: string, archiveURL: string) {
  const roomReference = roomDoc(roomID);
  await updateDoc(roomReference, {
    archive_url: archiveURL
  });
}

export async function toggleArchiveMode(roomID: string, isActive: boolean) {
  const roomReference = roomDoc(roomID);
  await updateDoc(roomReference, {
    stream_status: isActive ? "archive" : "idle"
  });
}