import React from "react";
import { Chat } from "../chat";
import VideoPlayer from "../videoPlayer";


const Chris: React.FC = () => {

  return (
    <div className="fullBleed overflowScroll">
      <VideoPlayer
        style={{
          width: "calc(2 * 100vw)",
          height: "calc(2 *56vw)",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: "0",
        }}
        className="noEvents"
      />
      <Chat
        className="quarterWidth"
        style={
          {
            "--chatAuthorColor": "hotpink",
            "--chatContainerBackground": "rgba(0,0,0,0.6)",
            "--chatMessageColor": "var(--white)",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

export default Chris;