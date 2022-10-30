import create from "zustand";
import { getStickerCDN } from "../lib/firestore";


interface StickerStoreState {
  changeRoomStickers: (roomID:string) => void,
  stickerCDN?: {[key:string] : Sticker}
}

const useStickerCDNStore = create<StickerStoreState>((set) => ({
  changeRoomStickers: (roomID: string) => {
    getStickerCDN(roomID, (c) => {
      set({stickerCDN: c });
     });
  },
  stickerCDN: undefined
}));

export default useStickerCDNStore;