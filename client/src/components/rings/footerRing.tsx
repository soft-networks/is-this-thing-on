import { useRouter } from "next/router";
import { useCallback, useMemo, } from "react";
import useGlobalRoomsInfoStore, { roomIDToHREF } from "../../stores/globalRoomsInfoStore";
import { roomIsArchive, useRoomStore } from "../../stores/currentRoomStore";
import { logError } from "../../lib/logger";




export const FooterRing: React.FC<{ isHome: boolean }> = ({ isHome }) => {
  // Only subscribe to current room ID
  const roomID = useRoomStore(useCallback((s) => s.currentRoomID, []));

  // Only get current room's info, not the whole ring
  const currentRoom = useRoomStore(useCallback((s) => s.roomInfo, []));

  const { push } = useRouter();

  function getCurrentState() {
    const rooms = useGlobalRoomsInfoStore.getState().rooms;
    const keys = Object.keys(rooms);
    const currentIndex = roomID ? keys.indexOf(roomID) : -1;
    return { keys, currentIndex };
  }
 

  const handlePrevClick = () => {
    const { keys, currentIndex } = getCurrentState();
    if (isHome) {
      push(roomIDToHREF(keys[keys.length - 1]));
      return;
    }
    if (currentIndex === 0) {
      push("/");
    } else {
      push(roomIDToHREF(keys[currentIndex - 1]));
    }
  };

  const handleNextClick = () => {
    const { keys, currentIndex } = getCurrentState();
    if (isHome) {
      push(roomIDToHREF(keys[0]));
      return;
    }
    if (currentIndex === keys.length - 1) {
      push("/");
    } else {
      push(roomIDToHREF(keys[currentIndex + 1]));
    }
  };

  if (!isHome && (!currentRoom || !roomID)) {
    logError("Footer failed. Room doesn't exist", [roomID]);
    return null;
  }

  return (
    <div className="centerh relative">
      <div className="horizontal-stack:s-2 align-end">
        <div
          className="whiteFill clickable clickable:link border padded:s-3 greenFill:hover"
          onClick={handlePrevClick}
        >
          ←
        </div>
        {isHome ? <HomeLabel /> : <RoomLabel link={currentRoom as RoomSummary} id={roomID as string} noNav />}
        <div
          className="whiteFill clickable clickable:link border padded:s-3 greenFill:hover"
          onClick={handleNextClick}
        >
          →
        </div>
      </div>
    </div>
  );
};

const HomeLabel = () => {
  return <div className="border padded:s-3 center-text" style={{ backgroundColor: "var(--contrast)" }}>
    <span>home</span>
  </div>
}


interface NodeLinkProps {
  link: RoomSummary;
  className?: string;
  noNav?: boolean;
  id: string;
}
export const RoomLabel: React.FC<NodeLinkProps> = ({
  link,
  className,
  noNav,
  id,
}) => {

  const getStatusText = (status: string) => {
    if (status.includes("active")) return "on";
    if (status === "archive") return "looping";
    return "off";
  };
  const text = useMemo(
    () => `${link.roomName} is ${getStatusText(link.streamStatus)}`,
    [link.roomName, link.streamStatus],
  );
  if (!link) {
    return null;
  }
  return (
    <div
      className={`border padded:s-3 center-text homepageLabelFooter ${roomIsArchive(link) ? "homepageLabelInverse" : "homepageLabel"}`}
      style={{
        backgroundColor: link.roomColor,

        "--bg": link.roomColor,
      } as React.CSSProperties}
    >
      {!noNav && link.streamStatus == "active" ? (
        <a href={roomIDToHREF(id)} target="_blank" rel="noreferrer">
          {" "}
          {text}{" "}
        </a>
      ) : (
        <span> {text} </span>
      )}
    </div>
  );
};
