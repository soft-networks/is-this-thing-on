import { useRouter } from "next/router";
import { useCallback, useMemo, } from "react";
import useGlobalRoomsInfoStore, { roomIDToHREF } from "../../stores/globalRoomsInfoStore";
import { useRoomStore } from "../../stores/currentRoomStore";
import { logError } from "../../lib/logger";




export const FooterRing: React.FC<{ isHome: boolean }> = ({ isHome }) => {
  // Only subscribe to current room ID
  const roomID = useRoomStore(useCallback((s) => s.currentRoomID, []));

  // Only get current room's info, not the whole ring
  const currentRoom = useRoomStore(useCallback((s) => s.roomInfo, []));

  const { push } = useRouter();

  // Move rooms data access to component level with useMemo
  const navigationData = useMemo(() => {
    const rooms = useGlobalRoomsInfoStore.getState().rooms;
    const keys = Object.keys(rooms);
    const currentIndex = roomID ? keys.indexOf(roomID) : -1;
    return { keys, currentIndex };
  }, [roomID]);

  // Simplified click handlers using memoized data
  const handlePrevClick = useCallback(() => {
    if (isHome) {
      push(roomIDToHREF(navigationData.keys[navigationData.keys.length - 1]));
      return;
    }
    if (navigationData.currentIndex === 0) {
      push("/");
    } else {
      push(roomIDToHREF(navigationData.keys[navigationData.currentIndex - 1]));
    }
  }, [navigationData, push, isHome]);

  const handleNextClick = useCallback(() => {
    if (isHome) {
      push(roomIDToHREF(navigationData.keys[0]));
      return;
    }
    if (navigationData.currentIndex === navigationData.keys.length - 1) {
      push("/");
    } else {
      push(roomIDToHREF(navigationData.keys[navigationData.currentIndex + 1]));
    }
  }, [navigationData, push, isHome]);

  if (!isHome && (!currentRoom || !roomID)) {
    logError("Footer failed. Room doesn't exist", [roomID]);
    return null;
  }

  return (
    <div className="centerh relative">
      <div className="horizontal-stack:s-2 align-end" style={{height: "40px", transform: "translateY(calc(var(--s0) * -1))"}}>
        <div
          className="whiteFill clickable clickable:link border padded:s-3 contrastFill:hover"
          onClick={handlePrevClick}
        >
          ←
        </div>
        {isHome ? <HomeLabel /> : <RoomLabel link={currentRoom as RoomSummary} id={roomID as string} noNav />}
        <div
          className="whiteFill clickable clickable:link border padded:s-3 contrastFill:hover"
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

  const text = useMemo(
    () =>
      `${link.roomName} is ${link.streamStatus.includes("active") ? "on" : "off"}`,
    [link.roomName, link.streamStatus],
  );
  if (!link) {
    return null;
  }
  return (
    <div
      className={`border padded:s-3 center-text homepageLabel ${className}`}
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
