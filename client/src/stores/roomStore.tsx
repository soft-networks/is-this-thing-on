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

export const roomIsActive = (roomInfo: RoomInfo | RoomLinkInfo | undefined | STREAM_STATUS_TYPE) => {
  if (typeof(roomInfo) == "string") {
    if  (roomInfo && roomInfo.includes("active")) {
      return true;
    } else {
      return false;
    }
  }
  if (roomInfo && roomInfo.streamStatus && roomInfo.streamStatus.includes("active")) {
    return true;
  } else {
    return false
  }
}


export const roomIsTest = (roomStatus?: string) => {
  if (roomStatus && roomStatus.includes("test")) {
    return true;
  } else {
    return false
  }
}