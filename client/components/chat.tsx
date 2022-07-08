import { DocumentReference, Unsubscribe } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { app } from "../lib/firebase-init";
import { addChatMessageDB, setRoom, setUserHeartbeat, detachUserHeartbeat } from "../lib/firestore";
import useCurrentStreamName from "../stores/useCurrentStreamName";

export const Chat: React.FC = () => {
  let streamName = useCurrentStreamName();
  let unsubRef = useRef<Unsubscribe>();
  let [chatList, setChatList] = useState<ChatMessage[]>([]);

  useEffect(() => {
    async function setupDB() {
      unsubRef.current = await setRoom(streamName, (c) => setChatList((p) => [c, ...p]));
    }
    setupDB();
    setUserHeartbeat("bhavik", streamName);
    return () => {
      if (unsubRef.current) unsubRef.current();
      detachUserHeartbeat("bhavik", streamName)
    };
  }, [streamName]);

  const addMessage = (s: string) => {
    addChatMessageDB(streamName, { message: s, userID: "bhavik", timestamp: Date.now() });
  };

  return (
    <div>
      <ChatInput onSubmit={addMessage} />
      <ul>
        {chatList.map((chatmessage, i) => (
          <li key={"message" + i}> {chatmessage.message} </li>
        ))}
      </ul>
    </div>
  );
};

const ChatInput: React.FC<{ onSubmit: (message: string) => void }> = ({ onSubmit }) => {
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const submitMessage = useCallback(() => {
    if (currentMessage) {
      onSubmit(currentMessage);
    }
    setCurrentMessage("");
  }, [currentMessage, onSubmit]);
  return (
    <div>
      <input
        value={currentMessage}
        onChange={(e) => {
          setCurrentMessage(e.target.value);
        }}
      />
      <div onClick={submitMessage} className="clickable">
        {" "}
        submit{" "}
      </div>
    </div>
  );
};
