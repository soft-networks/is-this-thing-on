import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import useGlobalRoomsInfoStore, { roomIDToHREF } from "../../stores/globalRoomsInfoStore";
import { useRoomStore } from "../../stores/currentRoomStore";

interface AutoScanRingProps {
  intervalSeconds?: number;
  onlyActiveRooms?: boolean;
}


export const AutoScanRing: React.FC<AutoScanRingProps> = ({ 
  intervalSeconds = 120,
  onlyActiveRooms = false 
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(intervalSeconds);
  const { push } = useRouter();
  
  // Get current room info
  const roomID = useRoomStore(useCallback((s) => s.currentRoomID, []));
  const rooms = useGlobalRoomsInfoStore.getState().rooms;
  
  const getAvailableRooms = useCallback(() => {
    const roomEntries = Object.entries(rooms);
    if (onlyActiveRooms) {
      return roomEntries.filter(([_, room]) => room.streamStatus.includes("active"));
    }
    return roomEntries;
  }, [rooms, onlyActiveRooms]);

  const goToNextRoom = useCallback(() => {
    const availableRooms = getAvailableRooms();
    if (availableRooms.length === 0) return;

    // If we're on home page, go to first room
    if (!roomID) {
      push(roomIDToHREF(availableRooms[0][0]));
      return;
    }

    const currentIndex = availableRooms.findIndex(([id]) => id === roomID);    
    // If we're at the end of the list, go back to home
    if (currentIndex === availableRooms.length - 1) {
      push("/");
    } else {
      // Otherwise go to next room
      const nextIndex = (currentIndex + 1) % availableRooms.length;
      const nextRoomId = availableRooms[nextIndex][0];
      push(roomIDToHREF(nextRoomId));
    }
  }, [roomID, push, getAvailableRooms]);

  // Reset timer when room changes
  useEffect(() => {
    if (isScanning) {
      setTimeLeft(intervalSeconds);
    }
  }, [roomID, intervalSeconds]);

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
          <>Stop Scan <Timer timeLeft={timeLeft}/></>
        ) : (
          "Start Scan"
        )}
      </div>
    </div>
  );
};
const Timer: React.FC<{timeLeft: number}> = ({timeLeft}) => {
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