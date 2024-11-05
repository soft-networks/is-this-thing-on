import { Chat } from "../interactive/chat";
import ChrisyStickers from "../interactive/custom/chrisyStickers";
import React from "react";
import VideoPlayer from "../videoPlayer";

const Chris: React.FC = () => {
  return (
    <main
      className="fullBleed noOverflow relative chrisyRoom"
      style={{ "--stickerGlowShadow": "none" } as React.CSSProperties}
    >
      <Chat
        key="chat"
        style={
          {
            "--chatBorderColor": "rgba(0,0,0,0.1)",
            "--chatMessageColor": "var(--black)",
            "--chatAuthorColor": "magenta",
          } as React.CSSProperties
        }
      />
      <VideoPlayer />
      <ChrisyStickers />
    </main>
  );
};

export default Chris;
