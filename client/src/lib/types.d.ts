
interface SarahQuestion {
  question: string;
  status?: "ACCEPTED";
}

type UserID = string;

type StickerCDN = { [key: string]: Sticker };
interface ChatMessage {
  timestamp: number;
  message: string;
  username: string;
  roomID: string;
}

interface StreamNames {
  names?: string[];
}

type STREAM_STATUS_TYPE = "active" | "disconnected" | "active-test";

interface RoomLinkInfo {
  roomID: string;
  roomName: string;
  roomColor: string;
  streamStatus: STREAM_STATUS_TYPE;
  streamPlaybackID?: string;
  consentURL?: string;
  previewOverlay?: string;
}
type WebRing = { [key: string]: RoomLinkInfo };

type RoomInfo = RoomLinkInfo & {
  streamOwner: string;
  numOnline: number;
};

type Pos = [number, number];

type BEHAVIOR_TYPES = "MOVE" | "DELETE";

interface Sticker {
  behaviorType: BEHAVIOR_TYPES;
  cdnID: string;
  imageURL: string;
  noGift: string;
  size?: number;
}
interface StickerInstance {
  position: Pos;
  size?: number;
  timestamp: number;
  cdnID: string;
  zIndex: number;
  text?: string;
}

interface RoomUIProps {
  className?: string;
  style?: React.CSSProperties;
}

interface UpdateRoomProps {
  roomName: string;
  roomId: string;
  roomColor: string;
  adminUserId: string;
}

type RtmpsDetails = { rtmpAddress: string; rtmpStreamKey: string };

