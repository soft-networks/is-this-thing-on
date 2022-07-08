import { Unsubscribe } from "firebase/firestore";
import { useCallback, useEffect,  useRef, useState } from "react";
import { addChatMessageDB, syncChat, setUserHeartbeat, detachUserHeartbeat } from "../lib/firestore";
import { useRoomStore } from "../stores/roomStore";
import { useUserStore } from "../stores/userStore";

export const Chat: React.FC = () => {
  let roomID = useRoomStore(state => state.currentRoomID);
  let unsubRef = useRef<Unsubscribe>();
  let [chatList, setChatList] = useState<{ [key: string]: ChatMessage }>({});
  useEffect(() => {
    async function setupDB() {
      if (unsubRef.current) {
        setChatList({});
        unsubRef.current();
      }
      unsubRef.current = await syncChat(
        roomID,
        (cID, chat) =>
          setChatList((pc) => {
            let npc = { ...pc };
            npc[cID] = chat;
            return npc;
          }),
        (cID) =>
          setChatList((pc) => {
            let npc = { ...pc };
            delete npc[cID];
            return npc;
          })
      );
    }
    setupDB();
    return () => {
      if (unsubRef.current) unsubRef.current();
    };
  }, [roomID]);

  const addMessage = (s: string) => {
    addChatMessageDB(roomID, { message: s, userID: "bhavik", timestamp: Date.now() });
  };

  return (
    <div>
      <ChatInput onSubmit={addMessage} />
      <ul>
        {Object.entries(chatList).map(([id, chat]) => (
          <li key={id}>
            {chat.userID}:{chat.message}
          </li>
        ))}
      </ul>
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
  return (
    <div>
      {currentUser ? (
        <div className="stack:smaller narrow" >
          <div> send message as {currentUser.email} </div>
          <input
            value={currentMessage}
            onChange={(e) => {
              setCurrentMessage(e.target.value);
            }}
          />
          <button onClick={submitMessage} className="clickable">
            submit
          </button>
        </div>
      ) : (
        <div> login to chat </div>
      )}
    </div>
  );
};
