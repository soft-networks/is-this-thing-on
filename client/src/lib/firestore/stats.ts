import { doc, onSnapshot } from "firebase/firestore";
import { statsCollection } from "./locations";
import { logInfo } from "../logger";

interface TotalOnline {
    total: number;
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
