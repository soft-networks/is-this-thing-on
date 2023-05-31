import React from "react";
import { Chat } from "../chat";
import VideoPlayer from "../videoPlayer";
import Stickers from "../stickers"; 


const Ambient: React.FC = () => {
  return (
    <div className="fullBleed overflowScroll">
      <VideoPlayer
        style={{
          width: "100%",
          height: "100%",
          zIndex: 0
        }}
        className="noEvents absoluteOrigin"
  
      />
      
    <iframe
      src="https://ambient.institute/sounds/"
      title="yahoo"
      width="80%" height="80%"
      style={{ overflow: "hidden" }}>
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
    </div>
  );
}



export default Ambient;