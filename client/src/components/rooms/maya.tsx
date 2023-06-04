import React from "react";
import { Chat } from "../chat";
import VideoPlayer from "../videoPlayer";
import Stickers from "../stickers"; 
import { EmptyChooser } from "../stickerAdders";


const Maya: React.FC = () => {
  return (
    <div className="fullBleed noOverflow" style={{background: "pink"}}>
      <VideoPlayer
        style={{
          width: "100%",
          height: "100%",
          zIndex: 0
        }}
        className="noEvents absoluteOrigin"
  
      />
      <Stickers style={{
          width: "100%",
          height: "100%"
        }} StickerChooser={EmptyChooser}/>
    </div>
  );
}

export default Maya;