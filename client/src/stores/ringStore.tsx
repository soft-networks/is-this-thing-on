import create from "zustand";
import ROOM_NAMES, { ONLINE_URLS, ROOM_COLORS } from "../../../common/commonData";

interface RingState {
  links: { [key: string]: RoomLinkInfo };
  updateStatus: (roomName: string, status: STREAM_STATUS_TYPE) => void;
}

const generateInitialNodes = () => {
  let roomDict: { [key: string]: RoomLinkInfo } = {};
  for (let i = 0; i < ROOM_NAMES.length; i++) {
    roomDict[ROOM_NAMES[i]] = {
      roomName: ROOM_NAMES[i],
      roomColor: ROOM_COLORS[i],
      streamStatus: "disconnected",
    };
  }
  return roomDict;
};

const useRingStore = create<RingState>((set) => ({
  links: generateInitialNodes(),
  updateStatus: (roomName, status) => {
    set((s) => {
      let ns = { ...s.links };
      ns[roomName] = { ...ns[roomName], streamStatus: status };
      return { links: ns };
    });
  },
}));

export default useRingStore;