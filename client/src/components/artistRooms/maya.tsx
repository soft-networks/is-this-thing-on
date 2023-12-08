import React from "react";
import VideoPlayer from "../videoPlayer";
import Stickers from "../interactive/stickers"; 
import { EmptyChooser } from "../interactive/stickerAdders";
import { Chat } from "../interactive/chat";
import AdminPanel from "../account/adminPanel";


const Maya: React.FC = () => {
  return (
    <main className="fullBleed noOverflow relative" style={{background: "pink"}}>
      <Chat  key="chat" />
      <VideoPlayer/>
      <Stickers StickerChooser={EmptyChooser}/>
      <AdminPanel/>
    </main>
  );
}

export default Maya;