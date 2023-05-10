import React, { useMemo } from "react";
import { Chat } from "../chat";
import VideoPlayer from "../videoPlayer";
import Stickers from "../stickers"; 
import Ring from "../ring";


const Compromised: React.FC = () => {

  const chats = useMemo(() => {
    let chats = [];
    for (let i =0 ;i<10; i++) {
      chats.push( <Chat
      className="absoluteOrigin"
        style={
          {
            "--chatAuthorColor": "hotpink",
            "--chatContainerBackground": "rgba(0,0,0,0)",
            "--chatMessageColor": "var(--white)",
            "--chatBorderColor": "black",
            zIndex: 99,
            position: "fixed",
            top: `${Math.random()*100}vh`,
            left: `${Math.random()*100}vw`,
          } as React.CSSProperties
        }
      />);
    };
    return chats;
  }, [])
  return (
    <div className="fullBleed overflowScroll" style={{background: "black"}}>
      <VideoPlayer
        style={{
          width: "100%",
          height: "100%",
          zIndex: 0
        }}
        className="noEvents absoluteOrigin"
  
      />
      <div style={{position: "absolute", top: "30%", left: "50%"}}>
       <Ring collapsed/>
       </div>
      {chats}
      <Stickers style={{
          width: "100%",
          height: "100%"
        }}/>
    </div>
  );
}

export default Compromised;