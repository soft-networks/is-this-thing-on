interface MagicPiece {
  id: string;
  triggerType?: any;
  pos: { x: number; y: number };
  asset?: string;
  reward?: number;
}

type UserID = string; 

interface ChatMessage {
  userID: UserID,
  timestamp: number,
  message: string,
  username: string
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

interface RoomInfo {
  streamStatus: string,
  streamOwner: string,
  streamPlaybackID: string
  numOnline: number,
  roomName: string
}

type Pos = [number, number];

type BehaviorTypes = "COIN";
interface InteractiveElement {
  position: Pos,
  behaviorType: string,
  cdnID?: string,
  timestamp: number
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

type TransactionCompleteCallback =  (status: TransactionStatus) => void

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