import create from "zustand";

type RoomState = {
  currentRoomID: string | null;
  changeRoom: (newRoom: string | null, roomInfo?: CurrentRoomInfo) => void;
  updateCurrentRoomInfo: (roomInfo: CurrentRoomInfo) => void;
  roomInfo: CurrentRoomInfo | undefined;
};

export const useRoomStore = create<RoomState>((set) => ({
  currentRoomID: null,
  roomInfo: undefined,
  changeRoom: (newRoom: string | null, roomInfo?: CurrentRoomInfo) => {
    //console.log("Room store updated", newRoom, roomInfo);
    set((s) => ({ currentRoomID: newRoom}));
  },
  updateCurrentRoomInfo: (roomInfo: CurrentRoomInfo) => {
    set((s) => ({ roomInfo: roomInfo }));
  }
}));

export const roomIsActive = (
  roomInfo: CurrentRoomInfo | RoomSummary | undefined | STREAM_STATUS_TYPE,
) => {
  if (roomIsTest(roomInfo)) {
    return true;
  }
  if (typeof roomInfo == "string") {
  
    if (roomInfo && roomInfo.includes("active")) {
      return true;
    } else {
      return false;
    }
  }
  if (
    roomInfo &&
    roomInfo.streamStatus &&
    (roomInfo.streamStatus.includes("active"))
  ) {
    return true;
  } else {
    return false;
  }
};

export const roomIsArchive = (
  roomInfo: CurrentRoomInfo | RoomSummary | undefined | STREAM_STATUS_TYPE,
) => {
  if (typeof roomInfo == "string") {
    if (roomInfo && roomInfo.includes("archive")) {
      return true;
    } else {
      return false;
    }
  }
  return roomInfo?.streamStatus === "archive";
};

export const roomIsTest = (
  roomInfo: CurrentRoomInfo | RoomSummary | undefined | STREAM_STATUS_TYPE,
) => {
  if (typeof roomInfo == "string") {
    
    if (roomInfo && roomInfo.includes("test")) {
      return true;
    } else {
      return false;
    }
  }
  if (
    roomInfo &&
    roomInfo.streamStatus &&
    (roomInfo.streamStatus.includes("test"))
  ) {
    return true;
  } else {
    return false;
  }
};
