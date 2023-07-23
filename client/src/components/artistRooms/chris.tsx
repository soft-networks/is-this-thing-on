import React from "react";
import VideoPlayer from "../videoPlayer";
import ChrisyStickers from "../interactive/custom/chrisyStickers";
import { Chat } from "../interactive/chat";
import AdminPanel from "../account/adminPanel";

const Chris: React.FC = () => {
  return (
    <main className="fullBleed noOverflow relative chrisyRoom">
      <Chat
        className=" absoluteOrigin"
        key="chat"
        style={
          {
            "--chatContainerBackground": "rgba(0,0,0,0.1)",
            "--chatBorderColor": "rgba(0,0,0,0.1)",
            "--chatMessageColor": "var(--white)",
            "--chatAuthorColor": "magenta",
          } as React.CSSProperties
        }
      />
      <VideoPlayer />
      <ChrisyStickers />
      <AdminPanel/>
    </main>
  );
};

export default Chris;
