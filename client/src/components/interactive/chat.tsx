import { Unsubscribe } from "firebase/firestore";
import React, { createRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Draggable from "react-draggable";
import { addChatMessageDB, syncChat } from "../../lib/firestore";
import useRingStore from "../../stores/ringStore";
import { useRoomStore } from "../../stores/roomStore";
import { useUserStore } from "../../stores/userStore";




export const Chat: React.FC<RoomUIProps> = ({className}) => {
  let roomID = useRoomStore((state) => state.currentRoomID);
  let roomColor = useRoomStore((state) => state.roomInfo?.roomColor);
  let unsubRef = useRef<Unsubscribe>();
  let [chatList, setChatList] = useState<{ [key: string]: ChatMessage }>({});
  let chatRef = createRef<HTMLDivElement>();
  let [filterRoom, setFilterRoom] = useState<boolean>(true);
  let [chatStyle, setChatStyle] = useState<React.CSSProperties>();

  
  useEffect(() => {
    let currentStyle = {
      "--chatAuthorColor": "var(--contrast)",
      "--chatMessageColor": "var(--light)",
      "--chatMessageBackgroundColor": roomColor,
      "--chatContainerBackground": "var(--black)",
      "--chatBorderColor": "var(--gray)"
    } as React.CSSProperties
    switch (roomID) {
      case "ambient": {
        let ambientStyle = {
          "--chatContainerBackground": "rgba(0,0,0,0)",
          "--chatBorderColor": "rgba(0,0,0,0)",
          "--chatMessageBackgroundColor": "rgba(0,0,0,0)",
          "--chatMessageColor": "var(--white)",
          "--chatAuthorColor": "var(--white)"
        } as React.CSSProperties;
        currentStyle = {...currentStyle, ...ambientStyle};
        break;
      }
      case "maya": {
        let ambientStyle = {
          "--chatContainerBackground": "rgba(0,0,0)",
          "--chatBorderColor": "rgba(0,0,0)",
          "--chatMessageBackgroundColor": "rgba(0,0,0)",
          "--chatMessageColor": "var(--white)",
          "--chatAuthorColor": "var(--white)"
        } as React.CSSProperties;
        currentStyle = {...currentStyle, ...ambientStyle};
        break;
      }
      case "chrisy": {
        let chrisStyle = {
          "--chatContainerBackground": "rgba(0,0,0,0.1)",
          "--chatBorderColor": "rgba(0,0,0,0.1)",
          "--chatMessageColor": "var(--white)",
          "--chatAuthorColor": "magenta"
        } as React.CSSProperties;
        currentStyle = {...currentStyle, ...chrisStyle};
        break;
      }
      case "molly": {
        let mollyStyle = {
          "--chatContainerBackground": "pink",
          "--chatBorderColor": "hotpink",
          "--chatMessageColor": "var(--black)",
          "--chatAuthorColor": "black"
        } as React.CSSProperties;
        currentStyle = {...currentStyle, ...mollyStyle};
        break;
      }
      case "compromised": {
        let compromisedStyle = {
          left: "37%",
          top: "30%",
          transform: "translate(-50%, 0%)"
        } as React.CSSProperties;
        currentStyle = {...currentStyle, ...compromisedStyle};
        break;
      }
      case "soft": {
        let softStyle = {
          "--chatContainerBackground": "rgb(189, 222, 239)",
          "--chatBorderColor": "rgb(135, 188, 215)",
          "--chatMessageColor": "rgb(70, 116, 91)",
          "--chatAuthorColor": "#183c28"
        }
        currentStyle = {...currentStyle, ...softStyle};
        break;
      }
      default: {

      }
    }
    setChatStyle(currentStyle);
  }, [roomID])

  const chatWasAdded = useCallback(
    (cID, chat) => {
      setChatList((pc) => {
        let npc = { ...pc };
        npc[cID] = chat;
        return npc;
      });
    },
    [setChatList]
  );
  const chatWasRemoved = useCallback(
    (cID) =>
      setChatList((pc) => {
        let npc = { ...pc };
        delete npc[cID];
        return npc;
      }),
    [setChatList]
  );
  const sendNewMessage = useCallback(
    (c:  {message: string, timestamp: number, username: string}) => {
      addChatMessageDB( {...c, roomID: roomID || "home"});
    },
    [roomID]
  );
  useEffect(() => {
    async function setupDB() {
      console.log("Setting up chat sync");
      if (unsubRef.current) {
        setChatList({});
        unsubRef.current();
      }
      unsubRef.current = await syncChat(chatWasAdded, chatWasRemoved);
    }
    setupDB();
    return () => {
      console.log("Destroying chat sync");
      if (unsubRef.current) unsubRef.current();
    };
  }, [chatWasAdded, chatWasRemoved]);
  return (
    <Draggable handle=".handle" nodeRef={chatRef} defaultPosition={{x: 10, y: 10}} disabled={roomID == "compromised"}>
      <div className={(className || "") + " chat everest border"} style={chatStyle} ref={chatRef}>
        <div className="handle" style={{ minHeight: "var(--sp0)", height: "var(--sp0)", background: "var(--chatBorderColor)" }}>
          ...
        </div>
        <ChatInput onSubmit={sendNewMessage} />
        <div className="padded:s-2 caption horizontal-stack clickable" style={{background: "var(--chatBackgroundColor)"}} onClick={() => setFilterRoom(!filterRoom)}>
          <input type="checkbox" checked={!filterRoom} onClick={() => setFilterRoom(!setFilterRoom)} readOnly />
          <p>listen in on other rooms</p>
        </div>
        <div
          className="stack:s-2 padded:custom"
          style={
            {
              "--spacing": "var(--s-4)",
              maxHeight: "20vw",
              overflowY: "auto",
            } as React.CSSProperties
          }
        >
          {Object.entries(chatList).sort( (a,b) => b[1].timestamp - a[1].timestamp)
          .map(([id, chat]) => {
            if (filterRoom && chat.roomID !== (roomID || "home")) {
              return null
            }
            return <RenderChat id={id} chat={chat} key={`chat-${id}`} />
          })}
      </div>
      </div>
    </Draggable>
  );
};

const getRoomNameForChat = (roomName: string) => {
  let rn = `in ${roomName}`;
  if (roomName.charAt(roomName.length -1 ) == "s") {
    rn += "'";
  } else {
    rn += "'s";
  }
  rn += " room";
  return rn;
}



const RenderChat : React.FC<{id: string, chat: ChatMessage}> = ({chat, id}) => {
  const links = useRingStore(s => s.links);
  const myRoom = useMemo(() => links[chat.roomID], [links, chat]);
  
  return (
    <div className="stack:noGap fullWidth align-start">
      <p
        key={id}
        className="padded:s-2 chatMessage border-radius"
        style={{ background: "var(--chatMessageBackgroundColor)", color: "var(--chatMessageColor)" }}
      >
        <div className="caption" style={{ color: "var(--chatMessageColor)" }}>
          {myRoom && myRoom.roomName ? getRoomNameForChat(myRoom.roomName) : "in the home room"}
        </div>
        <div>
          <em>{chat.username || "unknown"}</em>
          <span>: {chat.message}</span>
        </div>
      </p>
    </div>
  );
}

const ChatInput: React.FC<{ onSubmit: (chat: {message: string, timestamp: number, username: string}) => void }> = ({ onSubmit }) => {
  const displayName = useUserStore((state) => state.displayName);
  const numOnline = useRoomStore((state) => state.roomInfo?.numOnline);
  
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const submitMessage = useCallback(() => {
    if (currentMessage) {
      onSubmit({
        message: currentMessage,
        timestamp: Date.now(),
        username: displayName,
      });
    }
    setCurrentMessage("");
  }, [currentMessage, displayName, onSubmit]);
  return (
    <div className="stack:s-1 border-bottom padded:s-1 chatInputContainer">
      
      <div className="horizontal-stack"> 
        <div className="flex-1" suppressHydrationWarning> chat as {displayName} </div>
        {numOnline ? <div> {numOnline} people in this room </div> : null}
      </div>
      <div className="fullWidth horizontal-stack align-middle">
        <input
          value={currentMessage}
          className="flex-1 padded:s-2"
          onChange={(e) => {
            setCurrentMessage(e.target.value);
          }}
          onKeyPress={(e) => {
            if (e.key == "Enter") {
              submitMessage();
            }
          }}
        />
        <div onClick={submitMessage} className="clickable contrastColor:hover">
          send
        </div>
      </div>
      
    </div>
  )
};
