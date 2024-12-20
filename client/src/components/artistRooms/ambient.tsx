import { Chat } from "../interactive/chat";
import React from "react";
import VideoPlayer from "../video/videoPlayer";

const Ambient: React.FC = () => {
  return (
    <main
      className="fullBleed noOverflow relative"
      style={{ background: "#edf3f4" }}
    >
      <Chat
        key="chat"
        whiteText
        style={
          {
            "--chatContainerBackground": "rgba(0,0,0,0)",
            "--chatBorderColor": "rgba(0,0,0,0)",
            "--chatMessageBackgroundColor": "rgba(0,0,0,0)",
            "--chatMessageColor": "var(--white)",
            "--chatAuthorColor": "var(--white)",
            "--backgroundColor": "rgba(0,0,0,0)",
          } as React.CSSProperties
        }
      />
      <VideoPlayer />
    </main>
  );
};

export default Ambient;
