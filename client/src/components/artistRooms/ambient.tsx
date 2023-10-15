import React from "react";
import VideoPlayer from "../videoPlayer";
import { Chat } from "../interactive/chat";
import AdminPanel from "../account/adminPanel";

const Ambient: React.FC = () => {
  return (
    <main className="fullBleed noOverflow relative" style={{ background: "#edf3f4" }}>
      <iframe className="ambience absoluteOrigin videoLayer" src="https://ambient.institute/sounds" />
      <Chat className=" absoluteOrigin" key="chat" style={{
          "--chatContainerBackground": "rgba(0,0,0,0)",
          "--chatBorderColor": "rgba(0,0,0,0)",
          "--chatMessageBackgroundColor": "rgba(0,0,0,0)",
          "--chatMessageColor": "var(--white)",
          "--chatAuthorColor": "var(--white)"
        } as React.CSSProperties}/>
      <VideoPlayer
        muteOverride={true}
        hideMuteButton={true}
      />
      <AdminPanel/>
    </main>
  );
}

export default Ambient;