import { doc, setDoc } from "firebase/firestore";
import { presenceCollection } from "./locations";

const PRESENCE_LENGTH =  5 * 1000;

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
  //console.log(" Setting user presence " , roomName)
  await setPresenceDB(userID, roomName);
  activeTimeout = setTimeout(() => setUserHeartbeat(userID, roomName), PRESENCE_LENGTH);
}
