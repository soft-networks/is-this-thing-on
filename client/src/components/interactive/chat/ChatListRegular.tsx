import classNames from "classnames";
import { Unsubscribe } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useState, createRef, useRef, useEffect, useCallback } from "react";
import { addChatMessageDB, syncChat } from "../../../lib/firestore";
import { logInfo, logError, logCallbackSetup, logCallbackDestroyed } from "../../../lib/logger";
import { useRoomStore } from "../../../stores/currentRoomStore";
import { RenderChat } from "./RenderChat";
import { ChatInput } from "./ChatInput";
import { CHAT_HEIGHT, DEFAULT_STYLE } from "./utils";




export const ChatListRegular: React.FC<RoomUIProps & { whiteText?: boolean; }> = ({
  className, style = {}, whiteText,
}) => {
  let [chatList, setChatList] = useState<{ [key: string]: ChatMessage; }>({});
  let chatRef = createRef<HTMLDivElement>();
  let roomID = useRoomStore((state) => state.currentRoomID);
  let roomColor = useRoomStore((state) => state.roomInfo?.roomColor);
  let roomName = useRoomStore((state) => state.roomInfo?.roomName);
  const { pathname } = useRouter();
  let unsubRef = useRef<Unsubscribe>();
  let [filterRoom, setFilterRoom] = useState<boolean>(pathname !== "/");
  let [lastRecalculationUpdate, setLastRecalculationUpdate] = useState<number>(
    Date.now()
  );

  useEffect(() => {
    setLastRecalculationUpdate(Date.now());
  }, [chatList]);

  const sendNewMessage = useCallback(
    (c: { message: string; timestamp: number; username: string; }) => {
      addChatMessageDB({
        ...c,
        roomID: filterRoom ? roomID || "home" : "home",
      });
    },
    [filterRoom, roomID]
  );
  useEffect(() => {
    logInfo("ChatClient restarting");
    async function setupDB() {
      if (unsubRef.current !== undefined) {
        logError("Chat sync setup with one already there", [unsubRef.current]);
        unsubRef.current();
      }
      logCallbackSetup(`Chat ${roomID || "home"}`);
      unsubRef.current = await syncChat(
        setChatList,
        filterRoom ? roomID || "home" : "home"
      );
    }
    setupDB();
    return () => {
      logCallbackDestroyed(`Chat ${roomID || "home"}`);
      if (unsubRef.current) unsubRef.current();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterRoom]);
  return (
    <div
      className={(className || "") + " chat highestLayer"}
      style={filterRoom
        ? { ...DEFAULT_STYLE(roomColor || "gray", filterRoom), ...style }
        : ({
          ...DEFAULT_STYLE("gray", true),
          "--roomColor": "yellow",
        } as React.CSSProperties)}
      ref={chatRef}
      id="chat"
    >
      <div
        className="stack:s-2 chatScrollContainer"
        style={{
          "--spacing": "var(--s-2)",
          flexDirection: "column-reverse",
          maxHeight: `${CHAT_HEIGHT * 100}vh`,
          paddingBottom: "var(--s-1)",
          paddingTop: "var(--s1)",
        } as React.CSSProperties}
        onScroll={() => {
          setLastRecalculationUpdate(Date.now());
        }}
      >
        {Object.entries(chatList)
          .sort((a, b) => b[1].timestamp - a[1].timestamp)
          .map(([id, chat], index) => {
            if (roomID && filterRoom && chat.roomID !== roomID) {
              return null;
            }
            if (!filterRoom && chat.roomID !== "home") {
              return null;
            }
            return (
              <RenderChat
                alwaysShow={index <= 4}
                id={id}
                chat={chat}
                key={`chat-${id}`}
                lastRecalculationUpdate={lastRecalculationUpdate} />
            );
          })}
      </div>
      <div className="stack:s-2" style={whiteText ? { color: "black" } : {}}>
        <ChatInput onSubmit={sendNewMessage} />
        {roomID && (
          <div className="horizontal-stack:noGap fullWidth">
            <div
              className={classNames(
                "flex-1 clickable whiteFill border  center-text padded:s-3",
                { contrastFill: filterRoom }
              )}
              onClick={() => setFilterRoom(true)}
              style={{ borderRight: 0 }}
            >
              room chat
            </div>
            <div
              className={classNames(
                "flex-1 clickable whiteFill border center-text padded:s-3",
                { contrastFill: !filterRoom }
              )}
              onClick={() => setFilterRoom(false)}
            >
              thing chat
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
