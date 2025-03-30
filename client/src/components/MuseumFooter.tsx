import React from 'react';
import { useRoomStore } from '../stores/currentRoomStore';
import { useCallback } from 'react';

const getStatusText = (status: string) => {
    if (status.includes("active")) return "on";
    if (status === "archive") return "looping";
    return "off";
  };

const MuseumFooter: React.FC = () => {
const roomColor = useRoomStore(useCallback(s => s.roomInfo?.roomColor, []));
const roomName = useRoomStore(useCallback(s => s.roomInfo?.roomName, []));
const roomStatus = useRoomStore(useCallback(s => s.roomInfo?.streamStatus, []));
  return (
    <footer className="flex-1 contrastFill center:children border-top" style={{'--roomColor': roomColor} as React.CSSProperties}>
        <div className="grow-text">{roomName} is {getStatusText(roomStatus || "")}</div>
      {/* Add your museum-specific footer content here */}
    </footer>
  );
};

export default MuseumFooter; 