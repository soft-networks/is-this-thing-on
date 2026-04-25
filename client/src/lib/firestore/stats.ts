import { doc, onSnapshot } from "firebase/firestore";
import { statsCollection } from "./locations";
import { logInfo } from "../logger";

interface TotalOnline {
    total: number;
}


export function syncLiveDescription(callback: (info: { description: string | null; moreInfoURL: string | null }) => void) {
  const adminDoc = doc(statsCollection(), "admin");
  return onSnapshot(adminDoc, (docSnapshot) => {
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      callback({
        description: data.live_description || null,
        moreInfoURL: data.more_url || null,
      });
    } else {
      callback({ description: null, moreInfoURL: null });
    }
  });
}

export function syncTotalOnline(callback: (stats: number) => void) {
  const totalOnline = doc(statsCollection(), "total_online");

  
  const unsubscribe = onSnapshot(totalOnline, (docSnapshot) => {
    if (docSnapshot.exists()) {
      const data = docSnapshot.data() as TotalOnline;
      callback(data.total);
    } else {
      logInfo("No online stats document found");
      callback(0);
    }
  });

  return unsubscribe;
}

