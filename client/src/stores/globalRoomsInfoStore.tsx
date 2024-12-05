import slugify from "slugify";
import create from "zustand";

import { logFirebaseUpdate, logInfo } from "../lib/logger";

interface GlobalRoomsInfo {
  rooms: AllRoomsSummary;
  updateRoomInfo: (roomName: string, update: RoomSummary) => void;
  initializeRing: (ring: AllRoomsSummary) => void;
  onRoomCreatedOrDestroyed: (roomName: string, update: "created" | "destroyed", roomInfo: RoomSummary) => void;
}
const useGlobalRoomsInfoStore = create<GlobalRoomsInfo>((set) => ({
  rooms: {},
  initializeRing: (ring) => {
    logFirebaseUpdate("RingSync initialized");
    set({ rooms: ring });
  },
  updateRoomInfo: (roomName, updatedRoomInfo) => {
    set((s) => {
      const currentRoom = s.rooms[roomName];
      if (!currentRoom || 
          currentRoom.roomID !== updatedRoomInfo.roomID ||
          currentRoom.roomName !== updatedRoomInfo.roomName ||
          currentRoom.roomColor !== updatedRoomInfo.roomColor ||
          currentRoom.streamStatus !== updatedRoomInfo.streamStatus) {
        let ns = { ...s.rooms };
        ns[roomName] = updatedRoomInfo;
        logFirebaseUpdate(`RingSync Updated for ${roomName}`);
        return { rooms: ns };
      } else {
        logInfo(`Received unnecessary update for ${roomName}, not updating store`);
        return s;
      }
    });
  },
  onRoomCreatedOrDestroyed: (roomName, update, roomInfo) => {
    if (update === "destroyed") {
      set((s) => {
        let ns = { ...s.rooms };
        delete ns[roomName];
        return { rooms: ns };
      });
    } 
    if (update === "created") {
      set((s) => {
        let ns = { ...s.rooms };
        ns[roomName] = roomInfo;
        return { rooms: ns };
      });
    }
  },
}));

export const roomIDToHREF = (id: string) => {
  return `/${slugify(id)}`;
};

export default useGlobalRoomsInfoStore;
