import React from "react";
import VideoPlayer from "../videoPlayer";
import Stickers from "../interactive/stickers"; 
import { EmptyChooser } from "../interactive/stickerAdders";
import { Chat } from "../interactive/chat";


const Maya: React.FC = () => {
  return (
    <div className="fullBleed noOverflow" style={{background: "pink"}}>
      <Chat className=" absoluteOrigin" key="chat" />
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