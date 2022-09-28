import { Unsubscribe } from "firebase/firestore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { addChatMessageDB, syncChat } from "../lib/firestore/";
import { useRoomStore } from "../stores/roomStore";
import { useUserStore } from "../stores/userStore";




export const Chat: React.FC<RoomUIProps> = ({className, style}) => {
  let roomID = useRoomStore((state) => state.currentRoomID);
  let unsubRef = useRef<Unsubscribe>();
  let [chatList, setChatList] = useState<{ [key: string]: ChatMessage }>({});
  let roomColor = useRoomStore(useCallback((state) => state.roomInfo?.roomColor, []));
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
      roomID && addChatMessageDB(roomID, c);
    },
    [roomID]
  );
  useEffect(() => {
    async function setupDB() {
      if (!roomID) return;
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
    <div className={(className || "") + " chat"} style={style as React.CSSProperties}>
      <ChatInput onSubmit={sendNewMessage} />
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
          .map(([id, chat]) => (
            <p key={id} className="padded:custom chatMessage">
              <span style={{ color: roomColor || "gray" }}>{chat.username || "unknown"}</span>{" "}
              <span>{chat.message}</span>
            </p>
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
    <div className="stack:s-2 border-bottom padded chatInputContainer">
      {numOnline ? <div> {numOnline} people online </div> : null}
      <div> send message as {currentUser.displayName || currentUser.email} </div>
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
  ) : (
    <div> login to chat </div>
  );
};
