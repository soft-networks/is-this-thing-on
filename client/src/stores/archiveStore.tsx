import { create } from "zustand";

interface ArchiveState {
  archiveInfo: ArchiveInfo | null;
  rooms: AllArchiveRooms;
  currentRoomID: string | null;
  setArchiveInfo: (info: ArchiveInfo | null) => void;
  setRooms: (rooms: AllArchiveRooms) => void;
  setCurrentRoom: (roomID: string | null) => void;
  clearArchive: () => void;
}

const useArchiveStore = create<ArchiveState>((set) => ({
  archiveInfo: null,
  rooms: {},
  currentRoomID: null,
  setArchiveInfo: (info: ArchiveInfo | null) => {
    set({ archiveInfo: info });
  },
  setRooms: (rooms: AllArchiveRooms) => {
    set({ rooms });
  },
  setCurrentRoom: (roomID: string | null) => {
    set({ currentRoomID: roomID });
  },
  clearArchive: () => {
    set({ archiveInfo: null, rooms: {}, currentRoomID: null });
  },
}));

/** Convert an archive room to a RoomSummary for reuse with existing components */
export function archiveRoomToSummary(room: ArchiveRoomInfo): RoomSummary {
  return {
    roomID: room.roomID,
    roomName: room.roomName,
    roomColor: room.roomColor,
    streamStatus: "archive",
    archiveURL: room.archiveURL,
  };
}

export default useArchiveStore;
