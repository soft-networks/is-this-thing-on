import { doc, setDoc } from "firebase/firestore";

import { presenceCollection } from "./locations";
import { logInfo } from "../logger";

const PRESENCE_LENGTH = 5 * 1000;

export let activePresenceHeartbeat: NodeJS.Timeout | undefined;
async function setPresenceDB(userID: string, roomName: string) {
  const newpresence = doc(presenceCollection(), userID);
  await setDoc(newpresence, {
    room_id: roomName,
    timestamp: Date.now(),
  });
}
export async function setUserPresenceHeartbeat(userID: string, roomName: string) {
  //return;
  if (activePresenceHeartbeat) {
    clearTimeout(activePresenceHeartbeat);
  }
  // logInfo(`Setting user presence ${roomName}`)
  await setPresenceDB(userID, roomName);
  activePresenceHeartbeat = setTimeout(
    () => setUserPresenceHeartbeat(userID, roomName),
    PRESENCE_LENGTH,
  );
}
