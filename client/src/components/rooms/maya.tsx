import React from "react";
import { Chat } from "../chat";
import VideoPlayer from "../videoPlayer";
import Stickers from "../stickers"; 


const Maya: React.FC = () => {
  return (
    <div className="fullBleed overflowScroll" style={{background: "pink"}}>
      <VideoPlayer
        style={{
          width: "100%",
          height: "100%",
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
      <Stickers style={{
          width: "100%",
          height: "100%"
        }}/>
    </div>
  );
}

export default Maya;