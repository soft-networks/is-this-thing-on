interface MagicPiece {
  id: string;
  triggerType?: any;
  pos: { x: number; y: number };
  asset?: string;
  reward?: number;
}

type UserID = string; 


interface ChatMessage {
  timestamp: number,
  message: string,
  username: string,
  roomID: string
}

interface Collective {
  rewards: number;
  addReward: (amt: number) => void;
  user: string | undefined;
  createUser: (str: string) => void;
}

interface StreamNames {
  names?: string[];
}

type STREAM_STATUS_TYPE = "active" | "disconnected"
interface RoomLinkInfo {
  roomID: string,
  roomName: string,
  roomColor: string,
  streamStatus: STREAM_STATUS_TYPE,
  season0URL?: string,
  season0Href?: string,
  streamPlaybackID?: string,
}
type WebRing = {[key:string] : RoomLinkInfo};

type RoomInfo = RoomLinkInfo & {
  streamOwner: string,
  numOnline: number,
  energy: number
}



type Pos = [number, number];

type BEHAVIOR_TYPES = "MOVE" | "DELETE" | "NORMAL";
interface Sticker {
  behaviorType: BEHAVIOR_TYPES,
  cdnID: string,
  imageURL: string
}
interface StickerInstance {
  position: Pos,
  timestamp: number
  cdnID: string
}
interface EnergyAccount {
  userID: UserID,
  energy:  number
}

interface EnergyTransaction {
  from: UserID,
  to: UserID,
  amount: number,
  timestamp: number
}

interface EnergyTransactionPosted extends EnergyTransaction {
  status: TransactionStatus,
  id: string
}

type TransactionStatusTypes = "ERROR" | "SUCCESS" | "PENDING"
interface TransactionStatus {
  type: TransactionStatusTypes ,
  code?: string
}

interface TransactionError extends TransactionStatus {
  type: "ERROR",
  code: "INSUFFICIENT_BALANCE" | "NETWORK_ERROR" | "TIMEOUT"
}

interface RoomUIProps {
  className?: string
  style?: React.CSSProperties
}