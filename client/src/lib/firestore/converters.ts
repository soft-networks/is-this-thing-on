import { DocumentData } from "firebase/firestore";

export function validateRoomName(roomName: string) {
  if (!roomName || roomName == "") {
    return false;
  }
  return true;
}
export function sanitizeRoomInfo(data: DocumentData, id: string): RoomInfo {
  return {
    roomID: id,
    streamPlaybackID: data["stream_playback_id"] || undefined,
    season0URL: data["season0URL"] || undefined,
    season0Href: data["season0HREF"] || data["season0URL"] || undefined,
    streamOwner: "bhavik",
    streamStatus: data["stream_status"] || "disconnected",
    numOnline: data["num_online"] || 0,
    roomName: data['room_name'] || id,
    roomColor: data["room_color"] || "#FCFF54",
    energy: data["energy"] || 0
  };
}
export function sanitizeEnergyAccount(amount: number, id: string): EnergyAccount {
  return {
    userID: id,
    energy: amount,
  };
}

export function sanitizeChatForDB(chat: ChatMessage) {
  return chat;
}

export function sanitizeTransactionFromDB(transaction: any): EnergyTransactionPosted {
  const statusType = transaction["status"];
  let status: TransactionStatus | undefined;
  switch (statusType) {
    case "SUCCESS":
      status = { type: "SUCCESS" };
      break;
    case "PENDING":
      status = { type: "PENDING" };
      break;
    default:
      status = { type: "ERROR", code: statusType || "" };
      break;
  }

  return {
    id: transaction["id"] || "null",
    timestamp: transaction["timestamp"] || 0,
    status: status || {type: "ERROR", code: "SERVER_ERROR"},
    to: transaction["to"] || "null",
    from: transaction["from"] || "null",
    amount: transaction["amount"] || 0,
  };
}

export function sanitizeTransactionForDB(transaction: EnergyTransaction) {
  return { ...transaction, status: "PENDING" };
}

export function sanitizeStickerInstanceForDB(stickerInstance: StickerInstance) {
  let instance: { position: Pos, cdn_id: string, timestamp: number, size?: number} = {
    position: stickerInstance.position,
    cdn_id: stickerInstance.cdnID,
    timestamp: stickerInstance.timestamp
  };
  if (stickerInstance.size) {
    instance["size"] = stickerInstance.size
  }
  return instance;
}

function sanitizePosition(n?: [number, number]): Pos {
  if (n == undefined) return [0,0];
  if (n[0] <= 2) {
    return n
  } else {
    return [n[0]/1920, n[1]/1080]
  }
}

export function sanitizeStickerInstanceFromDB(stickerInstance: any): StickerInstance {
  return {
    position:  sanitizePosition(stickerInstance["position"]),
    cdnID: stickerInstance["cdn_id"] || undefined,
    timestamp: stickerInstance["timestamp"] || 0,
    size: stickerInstance["size"],
    zIndex: stickerInstance["zIndex"] || 100
  };
}

export function sanitizeStickerCDNFromDB(sticker: any, id:string): Sticker {
  return {
    cdnID: id ,
    behaviorType: sticker["type"] || "NORMAL",
    imageURL: sticker["url"],
    noGift: sticker["noGift"],
    size: sticker["size"] || undefined, 
  }
}