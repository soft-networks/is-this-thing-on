import { useRouter } from "next/router";
import { useCallback, useMemo, } from "react";
import useGlobalRoomsInfoStore, { roomIDToHREF } from "../../stores/globalRoomsInfoStore";
import { useRoomStore } from "../../stores/currentRoomStore";
import { NodeLink } from "./svg";
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
    if (navigationData.currentIndex === 0) {
      push("/");
    } else {
      push(roomIDToHREF(navigationData.keys[navigationData.currentIndex - 1]));
    }
  }, [navigationData, push]);

  const handleNextClick = useCallback(() => {
    if (navigationData.currentIndex === navigationData.keys.length - 1) {
      push("/");
    } else {
      push(roomIDToHREF(navigationData.keys[navigationData.currentIndex + 1]));
    }
  }, [navigationData, push]);

  if (!currentRoom || !roomID) {
    logError("Footer failed. Room doesn't exist", [roomID]);
    return null;
  }

  return (
    <div className="centerh relative">
      <div className="horizontal-stack:s-2">
        <div
          className="whiteFill clickable clickable:link border padded:s-3 contrastFill:hover"
          onClick={handlePrevClick}
        >
          ←
        </div>
        {isHome ? <HomeNode /> : <NodeLink link={currentRoom} id={roomID} noNav />}
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

const HomeNode = () => {
  return <div className="border padded:s-3 center-text" style={{ backgroundColor: "var(--contrast)" }}>
    <span>home</span>
  </div>
}
