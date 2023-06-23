import React from "react";
import VideoPlayer from "../videoPlayer";
import Stickers from "../interactive/stickers"; 
import { EmptyChooser } from "../interactive/stickerAdders";
import { Chat } from "../interactive/chat";


const Maya: React.FC = () => {
  return (
    <div className="fullBleed noOverflow" style={{background: "pink"}}>
      <Chat className=" absoluteOrigin" key="chat" style={{
          "--chatContainerBackground": "rgba(0,0,0)",
          "--chatBorderColor": "rgba(0,0,0)",
          "--chatMessageBackgroundColor": "rgba(0,0,0)",
          "--chatMessageColor": "var(--white)",
          "--chatAuthorColor": "var(--white)"
        } as React.CSSProperties} />
      <VideoPlayer/>
      <Stickers StickerChooser={EmptyChooser}/>
    </div>
  );
}

export default Maya;