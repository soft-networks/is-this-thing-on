import { doc, setDoc } from "firebase/firestore";
import { presenceCollection } from "./locations";
import { PRESENCE_LENGTH } from "../../../../common/streamData";

let activeTimeout: NodeJS.Timeout | undefined;
async function setPresenceDB(userID: string, roomName: string) {
  const newpresence = doc(presenceCollection(), userID);
  await setDoc(newpresence, {
    room_id: roomName,
    timestamp: Date.now(),
  });
}
export async function setUserHeartbeat(userID: string, roomName: string) {
  if (activeTimeout) {
    clearTimeout(activeTimeout);
  }
  await setPresenceDB(userID, roomName);
  activeTimeout = setTimeout(() => setUserHeartbeat(userID, roomName), PRESENCE_LENGTH);
}
