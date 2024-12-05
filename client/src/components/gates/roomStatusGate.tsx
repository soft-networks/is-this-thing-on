import { roomIsActive, useRoomStore } from "../../stores/roomStore";
import { useCallback, useMemo } from "react";

import ConsentGate from "./roomConsentGate";
import Head from "next/head";

/**
 * RoomStatusGate ensures the current room is active before rendering children
 * 
 * Assumes room exists (checked by RoomExistsGate)
 * 
 * Flow:
 * 1. Get room info from store
 * 2. If room info is loading, show loading state
 * 3. If room is active:
 *    - Show consent gate with children
 * 4. If room is inactive:
 *    - Show offline message
 */

const RoomStatusGate: React.FunctionComponent = ({ children }) => {
  const roomInfo = useRoomStore(useCallback((s) => s.roomInfo, []));
  return (
    <>
      {roomInfo == undefined && <div className="center:absolute">loading...</div>}
      {roomInfo && (
        <Head>
          <title>
            {roomInfo.roomName} is {roomIsActive(roomInfo) ? "ON" : "OFF"}
          </title>
        </Head>
      )}
      {roomInfo && roomIsActive(roomInfo) && (
        <ConsentGate>
          {children}
        </ConsentGate>
      )}
      {roomInfo && !roomIsActive(roomInfo) && (
        <div className="fullBleed">
          <div className="center:absolute highestLayer">
            {" "}
            offline... for now (archive here)
          </div>
        </div>
      )}
    </>
  );
};

export default RoomStatusGate;