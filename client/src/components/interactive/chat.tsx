import classNames from "classnames";
import { Unsubscribe } from "firebase/firestore";

import { useRouter } from "next/router";
import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { addChatMessageDB, deleteChatMessageDB, syncChat } from "../../lib/firestore";
import {
  logCallbackDestroyed,
  logCallbackSetup,
  logError,
  logInfo,
} from "../../lib/logger";
import { useRoomStore } from "../../stores/currentRoomStore";
import { useGlobalUserStore } from "../../stores/globalUserStore";
import useMediaQuery from "../../stores/useMediaQuery";
import { useGlobalAdminStore } from "../../stores/globalUserAdminStore";

const DEFAULT_STYLE = (roomColor: string, globalStyle: boolean) =>
  ({
    "--chatAuthorColor": globalStyle ? "yellow" : "var(--contrast)",
    "--chatMessageColor": "var(--black)",
    "--chatContainerBackground": "none",
    "--chatBorderColor": "var(--gray)",
    "--chatMessageBackgroundColor": "var(--roomColor)",
  }) as React.CSSProperties;

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

export const Chat: React.FC<RoomUIProps & { whiteText?: boolean }> = ({
}) => {
  return (<div className="inline-block highestLayer" style={{position: "absolute", bottom: "var(--s-1)", left: "var(--s-1)"}}><div className="contrastFill border padded:s-2 border-radius highestLayer">chat is gone...for now!</div></div>)
}

export const ChatInternal: React.FC<RoomUIProps & { whiteText?: boolean }> = ({
  className,
  style = {},
  whiteText,
}) => {
  let [chatList, setChatList] = useState<{ [key: string]: ChatMessage }>({});
  let chatRef = createRef<HTMLDivElement>();
  let roomID = useRoomStore((state) => state.currentRoomID);
  let roomColor = useRoomStore((state) => state.roomInfo?.roomColor);
  let roomName = useRoomStore((state) => state.roomInfo?.roomName);
  const { pathname } = useRouter();
  let unsubRef = useRef<Unsubscribe>();
  let [filterRoom, setFilterRoom] = useState<boolean>(pathname !== "/");
  let [lastRecalculationUpdate, setLastRecalculationUpdate] = useState<number>(
    Date.now(),
  );

  useEffect(() => {
    setLastRecalculationUpdate(Date.now());
  }, [chatList]);

  const sendNewMessage = useCallback(
    (c: { message: string; timestamp: number; username: string }) => {
      addChatMessageDB({
        ...c,
        roomID: filterRoom ? roomID || "home" : "home",
      });
    },
    [filterRoom, roomID],
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
        filterRoom ? roomID || "home" : "home",
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
      <div
        className="stack:s-2 chatScrollContainer"
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
      <div className="stack:s-2" style={whiteText ? { color: "black" } : {}}>
        <ChatInput onSubmit={sendNewMessage} />
        {roomID && (
          <div className="horizontal-stack:noGap fullWidth">
            <div
              className={classNames(
                "flex-1 clickable whiteFill border  center-text padded:s-3",
                { contrastFill: filterRoom },
              )}
              onClick={() => setFilterRoom(true)}
              style={{ borderRight: 0 }}
            >
              room chat
            </div>
            <div
              className={classNames(
                "flex-1 clickable whiteFill border center-text padded:s-3",
                { contrastFill: !filterRoom },
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

//Write a simple value remapping function like p5.js map
function remap(
  value: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number,
) {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

const RenderChat: React.FC<{
  id: string;
  chat: ChatMessage;
  lastRecalculationUpdate: number;
  alwaysShow?: boolean;
}> = ({ chat, id, lastRecalculationUpdate, alwaysShow }) => {

  const [myBlurPercentage, setMyBlurPercentage] = useState<number>(0);
  //Create a ref to reference the dom
  const myRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery();
  const isAdmin = useGlobalAdminStore((state) => state.isAdmin);
  useEffect(() => {
    if (myRef.current) {
      const y = myRef.current.getBoundingClientRect().top;
      let percentage = remap(
        y,
        (CHAT_HEIGHT - 0.05) * window.innerHeight,
        window.innerHeight - 400,
        0,
        1,
      );
      //percentage = 0;
      if (!isMobile) {
        setMyBlurPercentage(percentage);
      } else {
        setMyBlurPercentage(1);
      }
    }
  }, [myRef.current, lastRecalculationUpdate]);

  return (
    <div
      className="stack:noGap fullWidth align-start relative chatBubble inline-block"
      style={{
        marginBlockStart: "var(--s-2)",
        opacity: alwaysShow ? 1 : myBlurPercentage,
      }}
      ref={myRef}
      key={id + "chat-" + isAdmin}
    >
      <div className="horizontal-stack:s-2">
        <div
          className="caption backgroundFill border-radius border inline-block"
          style={{ top: "-17px", padding: "4px" }}
        >
          {chat.username || "unknown"}
        </div>
        {isAdmin && <div className="caption whiteFill greenFill:hover border cursor:pointer" style={{ padding: "4px" }} onClick={() => deleteChatMessageDB(id)}>
          delete
        </div>}
      </div>
      <div
        key={id}
        className="padded:s-2 chatMessage border-radius relative inline-block border "
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
  const displayName = useGlobalUserStore((state) => state.displayName);
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
        className="padded:s-2 flex-1 whiteFill border "
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
        className="clickable padded:s-2 backgroundFill border contrastFill"
        style={{ borderLeft: "none" }}
      >
        send
      </div>
    </div>
  );
};
