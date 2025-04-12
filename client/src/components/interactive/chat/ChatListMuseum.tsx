import React, { useState, useEffect, useRef } from "react";
import { Unsubscribe } from "firebase/firestore";
import { syncChat } from "../../../lib/firestore";
import { useRoomStore } from "../../../stores/currentRoomStore";
import { RenderChat } from "./RenderChat";
import { DEFAULT_STYLE } from "./utils";
import classNames from "classnames";

const OLD_CHAT_DELAY = 0 * 60 * 1000; // 10 minutes in milliseconds

//todo: optimization where we actually delete messages when they are too old/off screen

export const ChatListMuseum: React.FC<RoomUIProps & { whiteText?: boolean; }> = ({
    className, style = {}, whiteText,
}) => {
    const timeWhenLoaded = useRef<number>(Date.now() - OLD_CHAT_DELAY);
    let [chatList, setChatList] = useState<{ [key: string]: ChatMessage; }>({});
    let roomID = useRoomStore((state) => state.currentRoomID);
    let unsubRef = useRef<Unsubscribe>();
    let roomColor = useRoomStore((state) => state.roomInfo?.roomColor);

    useEffect(() => {
        console.log(chatList);
    }, [chatList]);

    useEffect(() => {
        async function setupDB() {
            if (unsubRef.current !== undefined) {
                unsubRef.current();
            }
            unsubRef.current = await syncChat(setChatList, roomID || "home", Date.now());
        }
        setupDB();
        return () => {
            if (unsubRef.current) unsubRef.current();
        };
    }, [roomID, timeWhenLoaded.current]);

    return <div className="absoluteOrigin fullBleed videoInteractiveLayer" style={{...DEFAULT_STYLE("gray", true)} as React.CSSProperties} >
        {Object.entries(chatList)
            .sort((a, b) => b[1].timestamp - a[1].timestamp)
            .map(([id, chat]) => (
                <FloatingChatContainer key={`chatcontainer-${id}`} className={classNames({"h1": chat.message.length < 50})} >
                    <RenderChat
                        id={id}
                        chat={chat}
                        key={`chat-${id}`}
                        lastRecalculationUpdate={Date.now()}
                        alwaysShow={true}
                        hideControls={true}
                    />
                </FloatingChatContainer>
            ))}
    </div>;
};

const FloatingChatContainer: React.FC<{className?: string}> = ({children, className}) => {

    const startPos = useRef<number>(Math.random() * 0.6 + 0.2);
    return <div className={`absoluteOrigin animateOutAndAway narrow ${className}`} style={{left: `${startPos.current * 100}%`, transform: "translate(-50%, -50%)"}} >
         {children}
    </div>
}