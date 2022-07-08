interface MagicPiece {
  id: string;
  triggerType?: MagicPieceTriggerTypes;
  pos: { x: number; y: number };
  asset?: string;
  reward?: number;
}

type UserID = string; 


interface ChatMessage {
  userID: User,
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

interface StreamRoom {
  streamID: string,
  chat: string[],
  magicPices: MagicPiece[]
}

