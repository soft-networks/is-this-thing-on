import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import useGlobalRoomsInfoStore, { roomIDToHREF } from "../../stores/globalRoomsInfoStore";
import { useRoomStore } from "../../stores/currentRoomStore";

interface AutoScanRingProps {
    intervalSeconds?: number;
    onlyActiveRooms?: boolean;
}


export const AutoScanRing: React.FC<AutoScanRingProps> = ({
    intervalSeconds = 5,
    onlyActiveRooms = false
}) => {
    const [isScanning, setIsScanning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(intervalSeconds);
    const { push } = useRouter();

    // Get current room info
    const routerID = useRoomStore(useCallback((s) => s.currentRoomID || "home", []));
    const rooms = useGlobalRoomsInfoStore.getState().rooms;

    const getAvailableRooms = useCallback(() => {
        let roomIDs = Object.keys(rooms);
        if (onlyActiveRooms) {
            return roomIDs.filter(id => rooms[id].streamStatus.includes("active"));
        }
        roomIDs.unshift("home");
        return roomIDs;
    }, [rooms, onlyActiveRooms]);

    const goToNextRoom = useCallback(() => {
        const availableRooms = getAvailableRooms();
        
        const currentIndex = availableRooms.findIndex(id => id === routerID);
        const nextIndex = (currentIndex + 1) % availableRooms.length;
        const nextRoomId = availableRooms[nextIndex];
        if (nextRoomId === "home") {
            push("/");
        } else {
            push(roomIDToHREF(nextRoomId));
        }
    }, [routerID, push, getAvailableRooms]);

    // Reset timer when room changes
    useEffect(() => {
        if (isScanning) {
            setTimeLeft(intervalSeconds);
        }
    }, [routerID, intervalSeconds]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        let countdown: NodeJS.Timeout;

        if (isScanning) {
            interval = setInterval(goToNextRoom, intervalSeconds * 1000);
            countdown = setInterval(() => {
                setTimeLeft(prev => Math.max(0, prev - 0.1));
            }, 100);
        } else {
            setTimeLeft(intervalSeconds);
        }

        return () => {
            if (interval) clearInterval(interval);
            if (countdown) clearInterval(countdown);
        };
    }, [isScanning, intervalSeconds, goToNextRoom]);

    return (
        <div className="centerh relative">
            <div
                className={`whiteFill clickable clickable:link border padded:s-3 ${isScanning ? 'contrastFill' : ''}`}
                onClick={() => setIsScanning(!isScanning)}
            >
                {isScanning ? (
                    <>Stop Scan <Timer timeLeft={timeLeft} /></>
                ) : (
                    "Start Scan"
                )}
            </div>
        </div>
    );
};
const Timer: React.FC<{ timeLeft: number }> = ({ timeLeft }) => {
    if (timeLeft >= 60) {
        const minutes = Math.ceil(timeLeft / 60);
        return (
            <span className="padded:s-1">
                {minutes}m
            </span>
        );
    }
    return (
        <span className="padded:s-1">
            {Math.ceil(timeLeft)}s
        </span>
    );
};