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
  message: string
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
}
