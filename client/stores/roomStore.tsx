import create from "zustand"

type RoomState = {
  currentRoomID: string,
  changeRoom: (newRoom: string, roomInfo: RoomInfo) => void
  roomInfo: RoomInfo | undefined
} 


export const useRoomStore = create<RoomState>((set) => ({
  currentRoomID: "",
  roomInfo: undefined,
  changeRoom: (newRoom: string, roomInfo: RoomInfo) => {
    console.log("Room store updated", newRoom, roomInfo);
    set((s) => ({currentRoomID: newRoom, roomInfo: roomInfo}));
  }
}))