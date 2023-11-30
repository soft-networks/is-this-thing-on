import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { darlaSpinnerDoc, roomDoc } from "../locations";
import { addStickerInstance } from "../stickers";

// const waitingPeriod = 5 * 60 * 1000;
 const waitingPeriod = 2 * 1000;
 const distFromCenter = 0.2;
 const maxLength = 0.5; 

export async function addDarlaStickers(stickerType: string, size?: number) {
  const maxStickers = Math.floor(Math.random() * 3 + 7);

  let angle = 0; 

  const s = size || 0.1;
  for (let i=0; i< maxStickers; i++) {
    const wobbledRadius = distFromCenter + Math.random() * (maxLength - distFromCenter);
    const x = 0.5 + wobbledRadius * Math.cos(angle);
    const y = 0.5 + wobbledRadius * Math.sin(angle);
    const stickerInstance: StickerInstance ={
      cdnID: stickerType,
      position: [x - s/2, y - s/2],
      size: s ,
      timestamp: Date.now(),
      zIndex: 1,
    }
    console.log("ADDING STICKER", stickerInstance)
    await addStickerInstance("messydarla", stickerInstance);
    angle += Math.PI / 4 + (Math.PI/8 * Math.random());
  }
}
export function resetNextSpinTime(winningUser: string) {
  // const currentTime = Math.floor(new Date().getTime() / 1000);
  const currentTime = Date.now();
  const nextSpinTime = currentTime + waitingPeriod;
  const spinLocation = Math.random();
  setDoc(darlaSpinnerDoc(), { nextSpinTime: nextSpinTime, spinLocation: spinLocation, winningUser: winningUser }, { merge: true });
}

export function syncSpin(spinUpdatedCallback: (nextSpinTime: number, nextSpinAmount: number, winner: string) => void) {
  const roomDocRef = darlaSpinnerDoc();
  const unsub = onSnapshot(roomDocRef, (doc) => {
    const data = doc.data();
    if (data) {
      spinUpdatedCallback(data.nextSpinTime, data.spinLocation, data.winningUser);
    }
  });
  return unsub;
}
