import { Unsubscribe } from "firebase/firestore";
import React, { createRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Draggable from "react-draggable";
import { addChatMessageDB, syncChat } from "../lib/firestore/";
import useRingStore from "../stores/ringStore";
import { useRoomStore } from "../stores/roomStore";
import { useUserStore } from "../stores/userStore";




export const Chat: React.FC<RoomUIProps> = ({className, style}) => {
  let roomID = useRoomStore((state) => state.currentRoomID);
  let unsubRef = useRef<Unsubscribe>();
  let [chatList, setChatList] = useState<{ [key: string]: ChatMessage }>({});
  let chatRef = createRef<HTMLDivElement>();
  let [filterRoom, setFilterRoom] = useState<boolean>(false);

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
      if (unsubRef.current) {
        setChatList({});
        unsubRef.current();
      }
      unsubRef.current = await syncChat(chatWasAdded, chatWasRemoved);
    }
    setupDB();
    return () => {
      if (unsubRef.current) unsubRef.current();
    };
  }, [chatWasAdded, chatWasRemoved]);
  return (
    <Draggable handle=".handle" nodeRef={chatRef}>
      <div className={(className || "") + " chat highest border"} style={style as React.CSSProperties} ref={chatRef}>
        <div className="handle" style={{ height: "var(--sp-2)", background: "var(--chatBorderColor)" }}>
          .
        </div>
        <ChatInput onSubmit={sendNewMessage} />
        <div className="padded:s-2 caption horizontal-stack clickable" style={{background: "var(--black)"}} onClick={() => setFilterRoom(!filterRoom)}>
          <input type="checkbox" checked={filterRoom} onChange={() => setFilterRoom(!setFilterRoom)}  />
          <p>see messages in this room only</p>
        </div>
        <div
          className="stack:s-3 padded:custom"
          style={
            {
              "--stackSpacing": "var(--s-4)",
              "--spacing": "var(--s-4)",
              maxHeight: "20vw",
              overflowY: "auto",
            } as React.CSSProperties
          }
        >
          {Object.entries(chatList)
          .reverse()
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

const RenderChat : React.FC<{id: string, chat: ChatMessage}> = ({chat, id}) => {
  const links = useRingStore(s => s.links);
  const myRoom = useMemo(() => links[chat.roomID], [links, chat]);
  
  return (
    <p key={id} className="padded:custom chatMessage">
    <span style={{background:  myRoom  ? myRoom.roomColor : "gray"}}>@{myRoom ? myRoom.roomName : "home"}</span>{" "}
    <span style={{ color: "var(--chatAuthorColor)"}}>{chat.username || "unknown"}</span>{": "}
    <span>{chat.message}</span>
  </p>
  )
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
    <div className="stack:s-2 border-bottom padded chatInputContainer">
      {numOnline ? <div> {numOnline} people online </div> : null}
      <div> send message as {displayName} </div>
      <div className="fullWidth horizontal-stack">
        <input
          value={currentMessage}
          className="flex-1"
          onChange={(e) => {
            setCurrentMessage(e.target.value);
          }}
          onKeyPress={(e) => {
            if (e.key == "Enter") {
              submitMessage();
            }
          }}
        />
        <span onClick={submitMessage} className="button align-start">
          send
        </span>
      </div>
    </div>
  )
};
