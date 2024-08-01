import { Unsubscribe } from "firebase/firestore";
import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Draggable from "react-draggable";
import { addChatMessageDB, syncChat } from "../../lib/firestore";
import useRingStore from "../../stores/ringStore";
import { useRoomStore } from "../../stores/roomStore";
import { useUserStore } from "../../stores/userStore";
import {
  logCallbackDestroyed,
  logCallbackSetup,
  logError,
  logFirebaseUpdate,
  logInfo,
} from "../../lib/logger";
import classNames from "classnames";
import { useRouter } from "next/router";

const DEFAULT_STYLE = (roomColor: string, globalStyle: boolean) =>
  ({
    "--chatAuthorColor": globalStyle ? "yellow" : "var(--contrast)",
    "--chatMessageColor": "var(--black)",
    "--chatContainerBackground": "none",
    "--chatBorderColor": "var(--gray)",
    "--chatMessageBackgroundColor": "var(--roomColor)",
  } as React.CSSProperties);

//TODO: Fix the Chat Filter: so it actually creates/destroys callbacks.
//TODO: Don't load 100 chats. Filter by timestamp maybe. Or see if you can batch???

const CHAT_HEIGHT = 0.5;

const getRoomNameForChat = (roomName: string) => {
  let rn = `${roomName}`;
  if (roomName.charAt(roomName.length - 1) == "s") {
    rn += "'";
  } else {
    rn += "'s";
  }
  rn += "";
  return rn;
};

export const Chat: React.FC<RoomUIProps & {whiteText?: boolean}> = ({ className, style = {}, whiteText}) => {
  let [chatList, setChatList] = useState<{ [key: string]: ChatMessage }>({});
  let chatRef = createRef<HTMLDivElement>();
  let roomID = useRoomStore((state) => state.currentRoomID);
  let roomColor = useRoomStore((state) => state.roomInfo?.roomColor);
  let roomName = useRoomStore((state) => state.roomInfo?.roomName);
  const { pathname, back } = useRouter();
  let unsubRef = useRef<Unsubscribe>();
  let [filterRoom, setFilterRoom] = useState<boolean>(pathname !== "/");
  let [lastRecalculationUpdate, setLastRecalculationUpdate] = useState<number>(
    Date.now()
  );
  let [minimizeChat, setMinimizeChat] = useState<boolean>(false);

  
  useEffect(() => {
    setLastRecalculationUpdate(Date.now());
  }, [chatList]);
  const chatWasAdded = useCallback((cID, chat) => {
    logFirebaseUpdate("ChatMessage added");
    setChatList((pc) => {
      let npc = { ...pc };
      npc[cID] = chat;
      return npc;
    });
  }, []);
  const chatWasRemoved = useCallback((cID) => {
    logFirebaseUpdate("ChatMessage removed");
    setChatList((pc) => {
      let npc = { ...pc };
      delete npc[cID];
      return npc;
    });
  }, []);
  const sendNewMessage = useCallback(
    (c: { message: string; timestamp: number; username: string }) => {
      addChatMessageDB({ ...c, roomID: filterRoom ? (roomID || "home") : "home" });
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
      unsubRef.current = await syncChat(chatWasAdded, chatWasRemoved, filterRoom ? (roomID || "home") : "home");
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
      className={(className || "") + " chat uiLayer"}
      style={
        filterRoom
          ? { ...DEFAULT_STYLE(roomColor || "gray", filterRoom), ...style }
          : ({
              ...DEFAULT_STYLE("gray", true),
              "--roomColor": "yellow",
            } as React.CSSProperties)
      }
      ref={chatRef}
      id="chat"
    >
      {!minimizeChat && (
        <div
          className="stack:s-2 scrollOnHover"
          style={
            {
              "--spacing": "var(--s-2)",
              flexDirection: "column-reverse",
              maxHeight: `${CHAT_HEIGHT * 100}vh`,
              paddingBottom: "var(--s-1)",
              paddingTop: "var(--s1)",
            } as React.CSSProperties
          }
          onScroll={() => {
            console.log("SCROLLING");
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
                  lastRecalculationUpdate={lastRecalculationUpdate}
                />
              );
            })}
        </div>
      )}
      <div className="stack:s-2" style={whiteText ? {color: "black"} : {}}>
        {!minimizeChat && <ChatInput onSubmit={sendNewMessage} />}
        {roomID && (
          <div className="horizontal-stack:s-2" >
            <div className={classNames("clickable whiteFill border center-text padded:s-3 contrastFill:hover")} onClick={() => setMinimizeChat(!minimizeChat)}>
              {minimizeChat ? "open chat" : "minimize"}
            </div>
            {!minimizeChat && (
              <div className="horizontal-stack:noGap fullWidth">
                <div
                  className={classNames(
                    "flex-1 clickable whiteFill border  center-text padded:s-3",
                    { contrastFill: filterRoom }
                  )}
                  onClick={() => setFilterRoom(true)}
                  style={{ borderRight: 0 }}
                >
                  {roomName ? getRoomNameForChat(roomName) : "room"} chat
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
        )}
      </div>
    </div>
  );
};

//Write a simple value remapping function like p5.js map
function remap(
  value: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number
) {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

const RenderChat: React.FC<{
  id: string;
  chat: ChatMessage;
  lastRecalculationUpdate: number;
  alwaysShow?: boolean;
}> = ({ chat, id, lastRecalculationUpdate, alwaysShow }) => {
  const links = useRingStore((s) => s.links);
  const myRoom = useMemo(() => links[chat.roomID], [links, chat]);
  const [myBlurPercentage, setMyBlurPercentage] = useState<number>(0);
  //Create a ref to reference the dom
  const myRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (myRef.current) {
      const y = myRef.current.getBoundingClientRect().top;
      let percentage = remap(
        y,
        (CHAT_HEIGHT - 0.05) * window.innerHeight,
        window.innerHeight - 400,
        0,
        1
      );
      //percentage = 0;
      setMyBlurPercentage(percentage);
    }
  }, [myRef.current, lastRecalculationUpdate]);

  return (
    <div
      className="stack:noGap fullWidth align-start relative chatBubble"
      style={{ marginBlockStart: "var(--s-2)", opacity: alwaysShow ? 1 : myBlurPercentage }}
      ref={myRef}
    >
      <div
        className="caption backgroundFill border-radius border"
        style={{ top: "-17px", padding: "4px" }}
      >
        <em>{chat.username || "unknown"}</em>
      </div>
      <div
        key={id}
        className="padded:s-2 chatMessage border-radius relative align-start border "
        style={{
          background: "var(--chatMessageBackgroundColor)",
          color: "var(--chatMessageColor)",
          marginTop: "-3px",
        }}
      >
        <div>{chat.message}</div>
      </div>
    </div>
  );
};

const ChatInput: React.FC<{
  onSubmit: (chat: {
    message: string;
    timestamp: number;
    username: string;
  }) => void;
}> = ({ onSubmit }) => {
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
    <div className="fullWidth horizontal-stack:noGap align-middle chatInputContainer bod">
      <input
        value={currentMessage}
        placeholder={`chat as ${displayName}`}
        className="padded:s-1 flex-1 whiteFill border "
        onChange={(e) => {
          setCurrentMessage(e.target.value);
        }}
        onKeyPress={(e) => {
          if (e.key == "Enter") {
            submitMessage();
          }
        }}
      />
      <div
        onClick={submitMessage}
        className="clickable padded:s-1 backgroundFill border contrastFill"
        style={{ borderLeft: "none" }}
      >
        send
      </div>
    </div>
  );
};
