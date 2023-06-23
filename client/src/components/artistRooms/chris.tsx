import React from "react";
import VideoPlayer from "../videoPlayer";
import ChrisyStickers from "../interactive/custom/chrisyStickers";
import { Chat } from "../interactive/chat";

const Chris: React.FC = () => {
  return (
    <div className="fullBleed chrisyRoom noOverflow relative">
      <Chat
        className=" absoluteOrigin"
        key="chat"
        style={
          {
            "--chatContainerBackground": "rgba(0,0,0,0.1)",
            "--chatBorderColor": "rgba(0,0,0,0.1)",
            "--chatMessageColor": "var(--white)",
            "--chatAuthorColor": "magenta",
          } as React.CSSProperties
        }
      />
      <VideoPlayer />
      <ChrisyStickers />
    </div>
  );
};

export default Chris;
