import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import useGlobalRoomsInfoStore, { roomIDToHREF } from "../../stores/globalRoomsInfoStore";
import { roomIsActive, useRoomStore } from "../../stores/currentRoomStore";

interface AutoScanRingProps {
    intervalSeconds?: number;
    onlyActiveRooms?: boolean;
}


export const AutoScanRing: React.FC<AutoScanRingProps> = ({
    intervalSeconds = 5,
    onlyActiveRooms = true
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
            roomIDs = roomIDs.filter(id => roomIsActive(rooms[id]));
        }
        roomIDs.unshift("home");
        console.log("roomIDs", roomIDs);
        return roomIDs;
    }, [rooms, onlyActiveRooms]);

    const goToNextRoom = useCallback(() => {
        const availableRooms = getAvailableRooms();
        if (availableRooms.length === 1) {
            setTimeLeft(intervalSeconds); // Reset timer when there's nowhere to go
            return;
        }
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
                className={`whiteFill clickable border padded:s-3 greenFill:hover`}
                onClick={() => setIsScanning(!isScanning)}
            >
                {isScanning ? (
                    <>next in <Timer timeLeft={timeLeft} /></>
                ) : (
                    "scan rooms"
                )}
            </div>
        </div>
    );
};
const Timer: React.FC<{ timeLeft: number }> = ({ timeLeft }) => {
    if (timeLeft >= 60) {
        const minutes = Math.ceil(timeLeft / 60);
        return (
            <span>
                {minutes}m
            </span>
        );
    }
    return (
        <span>
            {Math.ceil(timeLeft)}s
        </span>
    );
};