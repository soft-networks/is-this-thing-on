import React from "react";
import { Chat } from "../chat";
import VideoPlayer from "../videoPlayer";
import Stickers from "../stickers"; 


const ChrisTemp: React.FC = () => {

  return (
    <div className="fullBleed overflowScroll">
      <VideoPlayer
        className=" absoluteOrigin"
        urlOverride="https://storage.googleapis.com/is-this-thing-on/chris/thing_description.mp4"
      />
      <Chat
        className="quarterWidth absoluteOrigin"
        style={
          {
            "--chatAuthorColor": "hotpink",
            "--chatContainerBackground": "rgba(0,0,0,0.6)",
            "--chatMessageColor": "var(--white)",
            zIndex: 3,
          } as React.CSSProperties
        }
      />
      <Stickers />
    </div>
  );
}

export default ChrisTemp;