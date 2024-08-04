import slugify from "slugify";
import create from "zustand";

import { logFirebaseUpdate } from "../lib/logger";

interface RingState {
  links: WebRing;
  updateStatus: (roomName: string, update: RoomLinkInfo) => void;
  initializeRing: (ring: WebRing) => void;
}
const useRingStore = create<RingState>((set) => ({
  links: {},
  initializeRing: (ring) => {
    logFirebaseUpdate("RingSync initialized");
    console.log(ring);
    set({ links: ring });
  },
  updateStatus: (roomName, updatedLink) => {
    logFirebaseUpdate(`RingSync Updated for ${roomName}`);
    set((s) => {
      let ns = { ...s.links };
      ns[roomName] = updatedLink;
      return { links: ns };
    });
  },
}));

export const roomIDToHREF = (id: string) => {
  return `/${slugify(id)}`;
};

export default useRingStore;
