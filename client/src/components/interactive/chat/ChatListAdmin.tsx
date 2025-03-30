import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { syncChat } from "../../../lib/firestore";
import { Unsubscribe } from "firebase/firestore";
import { logInfo, logError, logCallbackSetup, logCallbackDestroyed } from "../../../lib/logger";
import { RenderChat } from "./RenderChat";
import { DEFAULT_STYLE } from "./utils";



export const ChatListAdmin = () => {
    let [chatList, setChatList] = useState<{ [key: string]: ChatMessage; }>({});
    let unsubRef = useRef<Unsubscribe>();

    useEffect(() => {
        logInfo("ChatClient restarting");
        async function setupDB() {
            if (unsubRef.current !== undefined) {
                logError("Chat sync setup with one already there", [unsubRef.current]);
                unsubRef.current();
            }
            logCallbackSetup(`Chat admin`);
            unsubRef.current = await syncChat(
                setChatList,
                "admin"
            );
        }
        setupDB();
        return () => {
            logCallbackDestroyed(`Chat admin`);
            if (unsubRef.current) unsubRef.current();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (<div className="fullBleed stack:noGap overflowScroll" style={{...DEFAULT_STYLE("white", false)}}>
        {Object.entries(chatList)
          .sort((a, b) => b[1].timestamp - a[1].timestamp)
          .map(([id, chat], index) => {
            return (
              <RenderChat
                alwaysShow={true}
                id={id}
                chat={chat}
                key={`chat-${id}`}
                lastRecalculationUpdate={0}
                forceEnableDelete={true} />
            );
          })}
    </div>)
}