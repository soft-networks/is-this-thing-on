import React from "react";
import { Chat } from "../chat";
import VideoPlayer from "../videoPlayer";
import Stickers from "../stickers"; 

const Ambient: React.FC = () => {
  return (
    <div className="fullBleed overflowScroll" style={{background: "#edf3f4"}}>
      <VideoPlayer
        style={{
          width: "100%",
          height: "100%",
          zIndex: 0
        }}
        className="noEvents absoluteOrigin"
      />
      
    <iframe className="ambience" 
      src="https://ambient.institute/sounds"  />
      
      <Chat
        className="quarterWidth absoluteOrigin"
        style={
          {
            "--chatAuthorColor": "#d3ecef",
            "--chatContainerBackground": "rgba(0,0,0,0.1)",
            "--chatMessageColor": "var(--white)",
            zIndex: 3,
          } as React.CSSProperties
        }
      />
      
      <Stickers className="noEvents" style={{
          width: "100%",
          height: "100%"
        }}/>
    </div>
  );
}

export default Ambient;