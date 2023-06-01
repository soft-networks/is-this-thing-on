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
        className="fullBleed absoluteOrigin"
  
      />
      
      <Stickers className="noEvents" style={{
          width: "100%",
          height: "100%"
        }}/>
    </div>
  );
}

export default Ambient;