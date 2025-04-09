
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ChatListRegular } from "./chat/ChatListRegular";
import { useMuseumMode } from "../../stores/useMuseumMode";
import { ChatListMuseum } from "./chat/ChatListMuseum";
import { syncGlobalChatDisabled } from "../../lib/firestore";

export const Chat: React.FC<RoomUIProps & { whiteText?: boolean }> = ({
}) => {

  const [isGlobalChatDisabled, setIsGlobalChatDisabled] = useState(false);
  useEffect(() => {
    const unsub = syncGlobalChatDisabled(setIsGlobalChatDisabled);
    return () => unsub();
  }, []);

  const isMuseumMode = useMuseumMode(useCallback((state) => state.isMuseumMode, []));
  const isProjectorMode = useMuseumMode(useCallback((state) => state.isProjectorMode, []));
  if (isGlobalChatDisabled == true) {
    return (isMuseumMode || isProjectorMode ? null : <div className="inline-block highestLayer" style={{ position: "absolute", bottom: "var(--s-1)", left: "var(--s-1)" }}><div className="contrastFill border padded:s-2 border-radius highestLayer">chat is gone...for now!</div></div>)
  } else if (isMuseumMode || isProjectorMode) {
    return <ChatListMuseum />
  } else {
    return <ChatListRegular />
  }

}


