import React from "react";
import VideoPlayer from "../videoPlayer";
import Stickers from "../interactive/stickers"; 
import { EmptyChooser } from "../interactive/stickerAdders";
import { Chat } from "../interactive/chat";
import AdminPanel from "../account/adminPanel";


const Maya: React.FC = () => {
  return (
    <main className="fullBleed noOverflow relative" style={{background: "pink"}}>
      <Chat className=" absoluteOrigin" key="chat" style={{
          "--chatContainerBackground": "rgba(0,0,0)",
          "--chatBorderColor": "rgba(0,0,0)",
          "--chatMessageBackgroundColor": "rgba(0,0,0)",
          "--chatMessageColor": "var(--white)",
          "--chatAuthorColor": "var(--white)"
        } as React.CSSProperties} />
      <VideoPlayer/>
      <Stickers StickerChooser={EmptyChooser}/>
      <AdminPanel/>
    </main>
  );
}

export default Maya;