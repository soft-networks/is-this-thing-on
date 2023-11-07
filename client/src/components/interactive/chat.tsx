import { Unsubscribe } from "firebase/firestore";
import React, { createRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Draggable from "react-draggable";
import { addChatMessageDB, syncChat } from "../../lib/firestore";
import useRingStore from "../../stores/ringStore";
import { useRoomStore } from "../../stores/roomStore";
import { useUserStore } from "../../stores/userStore";
import { logCallbackDestroyed, logCallbackSetup, logError, logFirebaseUpdate, logInfo } from "../../lib/logger";


const DEFAULT_STYLE =  (roomColor: string) => ({
  "--chatAuthorColor": "var(--contrast)",
  "--chatMessageColor": "var(--light)",
  "--chatContainerBackground": "var(--black)",
  "--chatBorderColor": "var(--gray)",
  "--chatMessageBackgroundColor": roomColor,
} as React.CSSProperties);

//TODO: Fix the Chat Filter: so it actually creates/destroys callbacks.
//TODO: Don't load 100 chats. Filter by timestamp maybe. Or see if you can batch???

export const Chat: React.FC<RoomUIProps> = ({className, style = {}}) => {
  let [chatList, setChatList] = useState<{ [key: string]: ChatMessage }>({});
  let chatRef = createRef<HTMLDivElement>();
  let roomID = useRoomStore((state) => state.currentRoomID);
  let roomColor = useRoomStore((state) => state.roomInfo?.roomColor);
  let unsubRef = useRef<Unsubscribe>();
  let [filterRoom, setFilterRoom] = useState<boolean>(true);

  const chatWasAdded = useCallback(
    (cID, chat) => {
      logFirebaseUpdate("ChatMessage added");
      setChatList((pc) => {
        let npc = { ...pc };
        npc[cID] = chat;
        return npc;
      });
    },
    []
  );
  const chatWasRemoved = useCallback(
    (cID) => {
      logFirebaseUpdate("ChatMessage removed");
      setChatList((pc) => {
        let npc = { ...pc };
        delete npc[cID];
        return npc;
      });
    },
    []
  );
  const sendNewMessage = useCallback(
    (c:  {message: string, timestamp: number, username: string}) => {
      addChatMessageDB( {...c, roomID: roomID || "home"});
    },
    [roomID]
  );
  useEffect(() => {
    logInfo("ChatClient restarting");
    async function setupDB() {
      if (unsubRef.current !== undefined) {
        logError("Chat sync setup with one already there", [unsubRef.current]);
        unsubRef.current();
      }
      logCallbackSetup(`Chat ${roomID || 'home'}`)
      unsubRef.current = await syncChat(chatWasAdded, chatWasRemoved);
    }
    setupDB();
    return () => {
      logCallbackDestroyed(`Chat ${roomID || 'home'}`)
      if (unsubRef.current) unsubRef.current();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Draggable handle=".handle" nodeRef={chatRef} defaultPosition={{ x: 10, y: 10 }} disabled={roomID == "compromised" || roomID == "ambient"}>
      <div
        className={(className || "") + " chat uiLayer border"}
        style={{ ...DEFAULT_STYLE(roomColor || "gray"), ...style }}
        ref={chatRef}
        id="chat"
      >
        <div
          className="handle"
          style={{ minHeight: "var(--sp0)", height: "var(--sp0)", background: "var(--chatBorderColor)" }}
        >
          {roomID !== "compromised" && roomID !== "ambient" && "..."}
        </div>
        <ChatInput onSubmit={sendNewMessage} />
        <div
          className="padded:s-2 caption horizontal-stack clickable"
          style={{ background: "var(--chatBackgroundColor)" }}
          onClick={() => setFilterRoom(!filterRoom)}
        >
          <input type="checkbox" checked={!filterRoom} onClick={() => setFilterRoom(!setFilterRoom)} readOnly />
          <span>listen in on other rooms</span>
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
          {Object.entries(chatList)
            .sort((a, b) => b[1].timestamp - a[1].timestamp)
            .map(([id, chat]) => {
              if (filterRoom && chat.roomID !== (roomID || "home")) {
                return null;
              }
              return <RenderChat id={id} chat={chat} key={`chat-${id}`} />;
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
      <div
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
      </div>
    </div>
  );
}

const ChatInput: React.FC<{ onSubmit: (chat: {message: string, timestamp: number, username: string}) => void }> = ({ onSubmit }) => {
  const displayName = useUserStore((state) => state.displayName);
  //const numOnline = useRoomStore((state) => state.roomInfo?.numOnline);
  
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
        {/* {numOnline ? <div> {numOnline} people in this room </div> : null} */}
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
