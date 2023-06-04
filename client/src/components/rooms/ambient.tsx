import React from "react";
import { Chat } from "../chat";
import VideoPlayer from "../videoPlayer";
import Stickers from "../stickers"; 

const Ambient: React.FC = () => {
  return (
    <div className="fullBleed overflowScroll" style={{ background: "#edf3f4" }}>
      <iframe className="ambience absoluteOrigin high" src="https://ambient.institute/sounds" />

      <VideoPlayer
        style={{
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
        className="noEvents absoluteOrigin"
        muteOverride={true}
        hideMuteButton={true}
      />
    </div>
  );
}

export default Ambient;