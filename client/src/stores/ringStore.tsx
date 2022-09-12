import slugify from "slugify";
import create from "zustand";
import ROOM_NAMES, { ONLINE_URLS, ROOM_COLORS } from "../../../common/commonData";

interface RingState {
  links: WebRing;
  updateStatus: (roomName: string, update: RoomLinkInfo) => void;
  initializeRing: (ring: WebRing) => void;
}

const generatePlaceholderLinks = () => {
  let roomDict: { [key: string]: RoomLinkInfo } = {};
  for (let i = 0; i < ROOM_NAMES.length; i++) {
    roomDict[ROOM_NAMES[i]] = {
      roomName: ROOM_NAMES[i],
      roomColor: ROOM_COLORS[i],
      streamStatus: "disconnected",
    };
  }
  console.log()
  return roomDict;
};

const useRingStore = create<RingState>((set) => ({
  links: {},
  initializeRing: (ring) => { set({links: ring})},
  updateStatus: (roomName, updatedLink) => {
    set((s) => {
      let ns = { ...s.links };
      ns[roomName] = updatedLink;
      return { links: ns };
    });
  },
}));

export const roomIDToHREF = (id: string) => {
  return `/streams/${slugify(id)}`;
}


export default useRingStore;