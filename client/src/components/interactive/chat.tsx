
import React, {
  useCallback,
  useMemo,
} from "react";
import { ChatListRegular } from "./chat/chatListRegular";
import { useMuseumMode } from "../../stores/useMuseumMode";
import { ChatListMuseum } from "./chat/ChatListMuseum";

const DISABLE_CHAT = false;
export const Chat: React.FC<RoomUIProps & { whiteText?: boolean }> = ({
}) => {

  const isMuseumMode = useMuseumMode(useCallback((state) => state.isMuseumMode, []));
  if (DISABLE_CHAT) {
    return (<div className="inline-block highestLayer" style={{position: "absolute", bottom: "var(--s-1)", left: "var(--s-1)"}}><div className="contrastFill border padded:s-2 border-radius highestLayer">chat is gone...for now!</div></div>)
  } if (isMuseumMode) {
    return <ChatListMuseum />
  } else {
    return <ChatListRegular />
  }
  
}


