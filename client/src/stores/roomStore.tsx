import create from "zustand"

type RoomState = {
  currentRoomID: string | null,
  changeRoom: (newRoom: string | null, roomInfo?: RoomInfo) => void
  roomInfo: RoomInfo | undefined
} 


export const useRoomStore = create<RoomState>((set) => ({
  currentRoomID: null,
  roomInfo: undefined,
  changeRoom: (newRoom: string | null, roomInfo?: RoomInfo) => {
    //console.log("Room store updated", newRoom, roomInfo);
    set((s) => ({currentRoomID: newRoom, roomInfo: roomInfo}));
  }
}))

export const roomIsActive = (roomInfo: RoomInfo | RoomLinkInfo | undefined) => {
  if (roomInfo && roomInfo.streamStatus.includes("active")) {
    return true;
  } else {
    return false
  }
}