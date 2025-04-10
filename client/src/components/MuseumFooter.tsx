import React, { useEffect, useState } from 'react';
import { useRoomStore } from '../stores/currentRoomStore';
import { useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { syncYouPrompts } from '../lib/firestore/youprompts';

const getStatusText = (status: string) => {
    if (status.includes("active")) return "on";
    if (status === "archive") return "looping";
    return "off";
};

const MuseumFooter: React.FC = () => {
    const { pathname, back } = useRouter();
    return pathname == "/" || pathname.includes("admin") ? (
        <MuseumFooterStatic />
    ) : (
        <MuseumFooterRoom />
    );
};

const MuseumFooterStatic: React.FC = () =>{
    return (
        <footer className="flex-1 contrastFill center:children border-top greenFill">
            <div className="grow-text">THING + YOU, MOMI MODE</div>
        </footer>
    )
}

const MuseumFooterRoom: React.FC = () => {
    const roomColor = useRoomStore(useCallback(s => s.roomInfo?.roomColor, []));
    const roomName = useRoomStore(useCallback(s => s.roomInfo?.roomName, []));
    const roomStatus = useRoomStore(useCallback(s => s.roomInfo?.streamStatus, []));
    const roomID = useRoomStore(useCallback(s => s.roomInfo?.roomID, []));
    return (
        <footer className="flex-1 contrastFill center:children border-top center-text" style={{ '--roomColor': roomColor } as React.CSSProperties}>
            <div className="museumtext">{roomName} is {getStatusText(roomStatus || "")}{roomID === "you" && roomStatus === "active" && <YouPromptFooter />}</div>  
            </footer>
    );
};

const PROMPT_INTERVAL = 2 * 60 * 1000;

const YouPromptFooter: React.FC = () => {
    const [youPrompts, setYouPrompts] = useState<string[]>([]);
    const [promptIndex, setPromptIndex] = useState(0);
    useEffect(() => {
        const unsubscribe = syncYouPrompts(setYouPrompts);
        
        const interval = setInterval(() => {
            setPromptIndex(prevIndex => {
                if (youPrompts.length === 0) return 0;
                return (prevIndex + 1) % youPrompts.length;
            });
        }, PROMPT_INTERVAL);

        return () => {
            unsubscribe();
            clearInterval(interval);
        };
    }, [youPrompts.length]);
    return  youPrompts[promptIndex] ? <span>, {youPrompts[promptIndex]}</span> : null;
    
};
export default MuseumFooter; 