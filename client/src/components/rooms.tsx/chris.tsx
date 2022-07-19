import React from "react";
import { Chat } from "../chat";
import VideoPlayer from "../videoPlayer";
import Coins from "./coins";


const Chris: React.FC = () => {

  return (
    <div className="fullBleed overflowScroll">
      <VideoPlayer
        style={{
          width: "calc(2 * 100vw)",
          height: "calc(2 *56vw)",
          zIndex: 0
        }}
        className="noEvents absoluteOrigin"
      />
      <Chat
        className="quarterWidth absoluteOrigin"
        style={
          {
            "--chatAuthorColor": "hotpink",
            "--chatContainerBackground": "rgba(0,0,0,0.6)",
            "--chatMessageColor": "var(--white)",
            zIndex: 3,
          } as React.CSSProperties
        }
      />
      <Coins/>
    </div>
  );
}

export default Chris;