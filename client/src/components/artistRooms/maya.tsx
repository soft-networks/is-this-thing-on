import React from "react";
import VideoPlayer from "../videoPlayer";
import Stickers from "../interactive/stickers"; 
import { EmptyChooser } from "../interactive/stickerAdders";
import { Chat } from "../interactive/chat";


const Maya: React.FC = () => {
  return (
    <div className="fullBleed noOverflow" style={{background: "pink"}}>
      <Chat className=" absoluteOrigin" key="chat" />
      <VideoPlayer/>
      <Stickers StickerChooser={EmptyChooser}/>
    </div>
  );
}

export default Maya;