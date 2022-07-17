import { Unsubscribe } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { addChatMessageDB, syncChat } from "../lib/firestore";
import { useRoomStore } from "../stores/roomStore";
import { useUserStore } from "../stores/userStore";

export const Chat: React.FC = () => {
  let roomID = useRoomStore((state) => state.currentRoomID);
  let unsubRef = useRef<Unsubscribe>();
  let [chatList, setChatList] = useState<{ [key: string]: ChatMessage }>({});

  const addChat = useCallback(
    (cID, chat) => {
      setChatList((pc) => {
        let npc = { ...pc };
        npc[cID] = chat;
        return npc;
      });
    },
    [setChatList]
  );
  const removeChat = useCallback(
    (cID) =>
      setChatList((pc) => {
        let npc = { ...pc };
        delete npc[cID];
        return npc;
      }),
    [setChatList]
  );
  const sendNewMessage = useCallback(
    (s: string) => {
      addChatMessageDB(roomID, { message: s, userID: "bhavik", timestamp: Date.now() });
    },
    [roomID]
  );
  useEffect(() => {
    async function setupDB() {
      if (unsubRef.current) {
        setChatList({});
        unsubRef.current();
      }
      unsubRef.current = await syncChat(roomID, addChat, removeChat);
    }
    setupDB();
    return () => {
      if (unsubRef.current) unsubRef.current();
    };
  }, [addChat, removeChat, roomID]);
  return (
    <div className="stack:s-1 border quarterWidth">
      <ChatInput onSubmit={sendNewMessage} />
      <div className="stack:s-1 padded">
        {Object.entries(chatList).map(([id, chat]) => (
          <div key={id} className="stack:s-2 whiteFill padded:s-2">
            <div className="caption">{chat.userID || "unknown"}</div>
            <div>{chat.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChatInput: React.FC<{ onSubmit: (message: string) => void }> = ({ onSubmit }) => {
  const currentUser = useUserStore((state) => state.currentUser);

  const [currentMessage, setCurrentMessage] = useState<string>("");
  const submitMessage = useCallback(() => {
    if (currentMessage) {
      onSubmit(currentMessage);
    }
    setCurrentMessage("");
  }, [currentMessage, onSubmit]);
  return currentUser ? (
    <div className="stack:s-1 border-bottom padded">
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
