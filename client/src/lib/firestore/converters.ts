import { DocumentData } from "firebase/firestore";

export function validateRoomName(roomName: string) {
  if (!roomName || roomName == "") {
    return false;
  }
  return true;
}

export function sanitizeRoomSummary(data: DocumentData, id: string): RoomSummary {
  return {
    roomID: id,
    roomName: data["room_name"] || id,
    roomColor: data["room_color"] || "#FCFF54",
    streamStatus: sanitizeStreamStatus(data["stream_status"]),
  };
}

export function sanitizeRoomInfo(data: DocumentData, id: string): CurrentRoomInfo {
  return {
    roomID: id,
    streamPlaybackID: data["stream_playback_id"] || undefined,
    streamOwner: "bhavik",
    streamStatus: sanitizeStreamStatus(data["stream_status"]),
    roomName: data["room_name"] || id,
    roomColor: data["room_color"] || "#FCFF54",
    consentURL: data["consentURL"] || undefined,
    previewOverlay: data["preview_overlay"] || undefined,
    archiveURL: data["archive_url"] || undefined,
  };
}

function sanitizeStreamStatus(data: string): STREAM_STATUS_TYPE {
  switch (data) {
    case "active":
      return "active";
    case "test":
    case "active-test":
      return "active-test";
    case "archive":
      return "archive";
    default:
      return "disconnected";
  }
}

export function sanitizeChatForDB(chat: ChatMessage) {
  return chat;
}

export function sanitizeStickerInstanceForDB(stickerInstance: StickerInstance) {
  let instance: {
    position: Pos;
    cdn_id: string;
    timestamp: number;
    size?: number;
    text?: string;
  } = {
    position: stickerInstance.position,
    cdn_id: stickerInstance.cdnID,
    timestamp: stickerInstance.timestamp,
  };
  if (stickerInstance.size) {
    instance["size"] = stickerInstance.size;
  }
  if (stickerInstance.text) {
    instance["text"] = stickerInstance.text;
  }
  return instance;
}

export function sanitizeRecordingFromDB(data: DocumentData) {
  // it comes in like recording_start_time, recording_end_time, recording_url return a recording object
  return {
    startTime: data["recording_start_time"],
    endTime: data["recording_end_time"],
    url: data["recording_url"],
  };
}

function sanitizePosition(n?: [number, number]): Pos {
  if (n == undefined) return [0, 0];
  if (n[0] <= 2) {
    return n;
  } else {
    return [n[0] / 1920, n[1] / 1080];
  }
}

export function sanitizeStickerInstanceFromDB(
  stickerInstance: any,
): StickerInstance {
  return {
    position: sanitizePosition(stickerInstance["position"]),
    cdnID: stickerInstance["cdn_id"] || undefined,
    timestamp: stickerInstance["timestamp"] || 0,
    size: stickerInstance["size"],
    zIndex: stickerInstance["zIndex"] || 100,
  };
}

export function sanitizeStickerCDNFromDB(sticker: any, id: string): Sticker {
  return {
    cdnID: id,
    behaviorType: sticker["type"] || "NORMAL",
    imageURL: sticker["url"],
    noGift: sticker["noGift"],
    size: sticker["size"] || undefined,
  };
}
