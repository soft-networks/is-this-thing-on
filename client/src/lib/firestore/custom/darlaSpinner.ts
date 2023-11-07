import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { darlaSpinnerDoc, roomDoc } from "../locations";
import { addStickerInstance } from "../stickers";

// const waitingPeriod = 5 * 60 * 1000;
const waitingPeriod = 30 * 1000;

async function addStickers() {
  const radius = Math.random() * 0.2 + 0.3;
  for (let i=0; i< 2*Math.PI; i+= Math.PI/4) {
    
    //generate a random point on circumfrence with this radius
    const x = 0.5 + radius * Math.cos(i);
    const y = 0.5 + radius * Math.sin(i);
    const stickerInstance: StickerInstance ={
      cdnID: "pie",
      position: [x, y],
      size: 0.1,
      timestamp: Date.now(),
      zIndex: 1,
    }
    console.log("ADDING STICKER", stickerInstance)
    await addStickerInstance("messydarla", stickerInstance);
  }
}
export function resetNextSpinTime() {
  // const currentTime = Math.floor(new Date().getTime() / 1000);
  const currentTime = Date.now();
  const nextSpinTime = currentTime + waitingPeriod;
  const spinLocation = Math.random();

  addStickers();
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
