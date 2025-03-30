import React, { useState, useCallback } from "react";
import { useGlobalUserStore } from "../../../stores/globalUserStore";


export const ChatInput: React.FC<{
  onSubmit: (chat: {
    message: string;
    timestamp: number;
    username: string;
  }) => void;
}> = ({ onSubmit }) => {
  const displayName = useGlobalUserStore((state) => state.displayName);
  //const numOnline = useRoomStore((state) => state.roomInfo?.numOnline);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const submitMessage = useCallback(() => {
    if (currentMessage) {
      onSubmit({
        message: currentMessage,
        timestamp: Date.now(),
        username: displayName,
      });
    }
    setCurrentMessage("");
  }, [currentMessage, displayName, onSubmit]);
  return (
    <div className="fullWidth horizontal-stack:noGap align-middle chatInputContainer bod">
      <input
        value={currentMessage}
        placeholder={`chat as ${displayName}`}
        className="padded:s-2 flex-1 whiteFill border "
        onChange={(e) => {
          setCurrentMessage(e.target.value);
        }}
        onKeyPress={(e) => {
          if (e.key == "Enter") {
            submitMessage();
          }
        }} />
      <div
        onClick={submitMessage}
        className="clickable padded:s-2 backgroundFill border contrastFill"
        style={{ borderLeft: "none" }}
      >
        send
      </div>
    </div>
  );
};
