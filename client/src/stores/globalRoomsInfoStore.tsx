import slugify from "slugify";
import create from "zustand";

import { logFirebaseUpdate } from "../lib/logger";

interface GlobalRoomsInfo {
  rooms: WebRing;
  updateRoomInfo: (roomName: string, update: RoomLinkInfo) => void;
  initializeRing: (ring: WebRing) => void;
}
const useGlobalRoomsInfoStore = create<GlobalRoomsInfo>((set) => ({
  rooms: {},
  initializeRing: (ring) => {
    logFirebaseUpdate("RingSync initialized");
    set({ rooms: ring });
  },
  updateRoomInfo: (roomName, updatedRoomInfo) => {
    logFirebaseUpdate(`RingSync Updated for ${roomName}`);
    set((s) => {
      let ns = { ...s.rooms };
      ns[roomName] = updatedRoomInfo;
      return { rooms: ns };
    });
  },
}));

export const roomIDToHREF = (id: string) => {
  return `/${slugify(id)}`;
};

export default useGlobalRoomsInfoStore;
