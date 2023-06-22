import React from "react";
import VideoPlayer from "../videoPlayer";
import { Chat } from "../interactive/chat";

const Ambient: React.FC = () => {
  return (
    <div className="fullBleed overflowScroll" style={{ background: "#edf3f4" }}>
      <iframe className="ambience absoluteOrigin high" src="https://ambient.institute/sounds" />
      <Chat className=" absoluteOrigin" key="chat" />
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