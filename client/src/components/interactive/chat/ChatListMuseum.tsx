import React, { useState, useEffect, useRef } from "react";
import { Unsubscribe } from "firebase/firestore";
import { syncAllRoomsChat } from "../../../lib/firestore";
import { useRoomStore } from "../../../stores/currentRoomStore";
import { RenderChat } from "./RenderChat";
import { DEFAULT_STYLE } from "./utils";
import classNames from "classnames";
import useGlobalRoomsInfoStore from "../../../stores/globalRoomsInfoStore";

const OLD_CHAT_DELAY = 0 * 60 * 1000; // 10 minutes in milliseconds

//todo: optimization where we actually delete messages when they are too old/off screen

export const ChatListMuseum: React.FC<RoomUIProps & { whiteText?: boolean; }> = ({
    className, style = {}, whiteText,
}) => {
    const timeWhenLoaded = useRef<number>(Date.now() - OLD_CHAT_DELAY);
    let [chatList, setChatList] = useState<{ [key: string]: ChatMessage; }>({});
    let roomID = useRoomStore((state) => state.currentRoomID);
    let unsubRef = useRef<Unsubscribe>();
    let rooms = useGlobalRoomsInfoStore((state) => state.rooms);

    useEffect(() => {
        console.log(chatList);
    }, [chatList]);
    useEffect(() => {
        async function setupDB() {
            if (unsubRef.current !== undefined) {
                unsubRef.current();
            }
            const filterBots = roomID != "chrisy";
            unsubRef.current = await syncAllRoomsChat(setChatList, Date.now(), filterBots);
        }
        setupDB();
        return () => {
            if (unsubRef.current) unsubRef.current();
        };
    }, [roomID, timeWhenLoaded.current]);

    return <div className="absoluteOrigin fullBleed interactiveStickerLayer noEvents" style={{...DEFAULT_STYLE("gray", true)} as React.CSSProperties} >
        {Object.entries(chatList)
            .sort((a, b) => b[1].timestamp - a[1].timestamp)
            .map(([id, chat]) => (
                <FloatingChatContainer key={`chatcontainer-${id}`} className={classNames({"h0": chat.message.length < 50, "h1": chat.message.length > 30})} roomColor={rooms[chat.roomID]?.roomColor || "white"} >
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

const FloatingChatContainer: React.FC<{className?: string, roomColor?: string}> = ({children, className, roomColor}) => {

    const startPos = useRef<number>(Math.random() * 0.4 + 0.4);
    return <div className={`absoluteOrigin animateOutAndAway ${className}`} style={{left: `${startPos.current * 100}%`, transform: "translate(-50%, -50%)", maxWidth: "25vvw", "--chatMessageBackgroundColor": roomColor} as React.CSSProperties} >
         {children}
    </div>
}