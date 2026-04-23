import { Unsubscribe } from "firebase/firestore";
import create from "zustand";
import { syncStickerCDN } from "../lib/firestore/stickers";

interface StickerStoreState {
  changeRoomStickers: (roomID: string) => void;
  unmountRoomStickers: () => void;
  stickerCDN?: { [key: string]: Sticker };
}

let unsub: Unsubscribe | undefined;

const useStickerCDNStore = create<StickerStoreState>((set) => ({
  changeRoomStickers: (roomID: string) => {
    if (unsub) unsub();
    unsub = syncStickerCDN(roomID, (c) => set({ stickerCDN: c }));
  },
  stickerCDN: undefined,
  unmountRoomStickers: () => {
    if (unsub) { unsub(); unsub = undefined; }
    set({ stickerCDN: undefined });
  },
}));

export default useStickerCDNStore;
