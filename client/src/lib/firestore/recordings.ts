import { onSnapshot } from "firebase/firestore";
import { recordingsCollection, roomDoc } from "./locations";
import { sanitizeRecordingFromDB } from "./converters";

export function onRecordingsUpdate(
  roomID: string,
  onRecordingsDidUpdate: (recordings: Recording[]) => void
) {
  const roomReference = roomDoc(roomID);
  const recordingsRef = recordingsCollection(roomReference);

  return onSnapshot(recordingsRef, (snapshot) => {
    const recordings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...sanitizeRecordingFromDB(doc.data())
    }))
    .sort((a, b) => {
      if (!a.endTime || !b.endTime) return 0;
      return new Date(b.endTime).getTime() - new Date(a.endTime).getTime();
    });
    onRecordingsDidUpdate(recordings);
  });
}
