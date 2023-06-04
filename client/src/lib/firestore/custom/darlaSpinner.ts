import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { darlaSpinnerDoc, roomDoc } from "../locations";

// const waitingPeriod = 5 * 60 * 1000;
const waitingPeriod = 60 * 1000;

export function resetNextSpinTime() {
  // const currentTime = Math.floor(new Date().getTime() / 1000);
  const currentTime = Date.now();
  const nextSpinTime = currentTime + waitingPeriod;
  const spinLocation = Math.random();

  setDoc(darlaSpinnerDoc(), { nextSpinTime: nextSpinTime, spinLocation: spinLocation }, { merge: true });
}

export function syncSpin(spintTimeUpdated: (nextSpinTime: number, nextSpinAmount: number) => void) {
  const roomDocRef = darlaSpinnerDoc();
  const unsub = onSnapshot(roomDocRef, (doc) => {
    const data = doc.data();
    if (data) {
      spintTimeUpdated(data.nextSpinTime, data.spinLocation);
    }
  });
  return unsub;
}
