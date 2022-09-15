import { Unsubscribe } from "firebase/firestore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { addChatMessageDB, syncChat } from "../lib/firestore/";
import { useRoomStore } from "../stores/roomStore";
import { useUserStore } from "../stores/userStore";


const DEFAULT_CLASSNAME = "stack:s-1 border fullWidth";
const DEFAULT_VARIABLES = {
  "--chatContainerBackground": "none",
  "--chatMessageBackground": "var(--white)",
  "--chatAuthorColor": "var(--contrast)",
  "--chatMessageColor": "var(--black)",
  "--chatBorderColor": "var(--gray)",
  "--spacing": "var(--s-2)"
};

export const Chat: React.FC<RoomUIProps> = ({className = DEFAULT_CLASSNAME, style = DEFAULT_VARIABLES}) => {
  let roomID = useRoomStore((state) => state.currentRoomID);
  let unsubRef = useRef<Unsubscribe>();
  let [chatList, setChatList] = useState<{ [key: string]: ChatMessage }>({});

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
    (c: ChatMessage) => {
      addChatMessageDB(roomID, c);
    },
    [roomID]
  );
  useEffect(() => {
    async function setupDB() {
      if (unsubRef.current) {
        setChatList({});
        unsubRef.current();
      }
      unsubRef.current = await syncChat(roomID, chatWasAdded, chatWasRemoved);
    }
    setupDB();
    return () => {
      if (unsubRef.current) unsubRef.current();
    };
  }, [chatWasAdded, chatWasRemoved, roomID]);
  return (
    <div className={className + " chat"} style={style as React.CSSProperties}>
      <ChatInput onSubmit={sendNewMessage} />
      <div className="stack:custom padded:custom" >
        {Object.entries(chatList).map(([id, chat]) => (
          <div key={id} className="stack:s-2  padded:s-2 chatMessage">
            <div className="caption">{chat.username || "unknown"}</div>
            <div>{chat.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChatInput: React.FC<{ onSubmit: (chat: ChatMessage) => void }> = ({ onSubmit }) => {
  const currentUser = useUserStore((state) => state.currentUser);
  const numOnline = useRoomStore((state) => state.roomInfo?.numOnline);
  
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const submitMessage = useCallback(() => {
    if (currentMessage && currentUser) {
      onSubmit({
        message: currentMessage,
        timestamp: Date.now(),
        username: currentUser.displayName || currentUser.email || "anon",
        userID: currentUser.uid,
      });
    }
    setCurrentMessage("");
  }, [currentMessage, currentUser, onSubmit]);
  return currentUser ? (
    <div className="stack:s-1 border-bottom padded chatInputContainer">
      {numOnline ? <div> {numOnline} people online </div> : null}
      <div> send message as {currentUser.email} </div>
      <input
        value={currentMessage}
        onChange={(e) => {
          setCurrentMessage(e.target.value);
        }}
      />
      <span onClick={submitMessage} className="button align-start">
        submit
      </span>
    </div>
  ) : (
    <div> login to chat </div>
  );
};
