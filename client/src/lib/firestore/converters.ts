import { DocumentData } from "firebase/firestore";

export function validateRoomName(roomName: string) {
  if (!roomName || roomName == "") {
    return false;
  }
  return true;
}
export function sanitizeRoomInfo(data: DocumentData, id: string): RoomInfo {
  return {
    streamPlaybackID: data["stream_playback_id"] || undefined,
    streamOwner: "bhavik",
    streamStatus: data["stream_status"] || "disconnected",
    numOnline: data["num_online"] || 0,
    roomName: data['room_name'] || id,
    roomColor: data["room_color"] || "#FCFF54"
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

export function sanitizeElementForDB(element: InteractiveElement) {
  return {
    position: element.position,
    behavior_type: element.behaviorType,
    cdn_id: element.cdnID,
    timestamp: element.timestamp,
  };
}

export function sanitizeElementFromDB(element: any): InteractiveElement {
  return {
    position: element.position || [0, 0],
    behaviorType: element["behavior_type"] || "UNKNOWN",
    cdnID: element["cdn_id"] || undefined,
    timestamp: element["timestamp"] || 0,
  };
}
