import React from "react";
import VideoPlayer from "../videoPlayer";
import ChrisyStickers from "../interactive/custom/chrisyStickers";
import { Chat } from "../interactive/chat";


const Chris: React.FC = () => {

  return (
    <div className="fullBleed chrisyRoom noOverflow relative">
      <Chat className=" absoluteOrigin" key="chat" />
      <VideoPlayer />
      <ChrisyStickers />
    </div>
  );
}

export default Chris;