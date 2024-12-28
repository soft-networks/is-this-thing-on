import { doc, onSnapshot, setDoc } from "firebase/firestore";

import { presenceCollection, presenceStatsDoc } from "./locations";

// Make sure to update firestore-api.ts if you update this.
const PRESENCE_LENGTH = 10 * 1000;

export let activePresenceHeartbeat: NodeJS.Timeout | undefined;
export let currentRoomName: string | undefined;

async function setPresenceDB(userID: string, roomName: string) {
  const newpresence = doc(presenceCollection(), userID);
  await setDoc(newpresence, {
    prev_room_id: currentRoomName || "",
    room_id: roomName,
    timestamp: Date.now(),
  });

  currentRoomName = roomName;
}
export async function setUserPresenceHeartbeat(
  userID: string,
  roomName: string,
) {
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
export async function syncPresence(
  onPresenceUpdate: (presenceStats: PresenceStats) => void,
) {
  return onSnapshot(presenceStatsDoc(), (snapshot) => {
    const presenceStatsData = snapshot.data() as PresenceStats;
    if (presenceStatsData) {
      onPresenceUpdate(presenceStatsData);
    }
  });
}
