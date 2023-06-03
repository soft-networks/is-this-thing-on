import React from "react";
import VideoPlayer from "../videoPlayer";
import ChrisyStickers from "../custom/chrisyStickers";


const Chris: React.FC = () => {

  return (
    <div className="fullBleed chrisyRoom" >
      <VideoPlayer className="fullBleed noEvents absoluteOrigin" />
      <ChrisyStickers/>
    </div>
  );
}

export default Chris;