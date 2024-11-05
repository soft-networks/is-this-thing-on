import RoomNameGate, { RoomStatusGate } from "./roomGate";
import {
  activePresenceHeartbeat,
  setUserPresenceHeartbeat,
  syncRoomInfoDB,
} from "../../lib/firestore";
import {
  logCallbackDestroyed,
  logCallbackSetup,
  logError,
  logInfo,
} from "../../lib/logger";
import { useCallback, useEffect, useMemo, useRef } from "react";

import AdminPanel from "../account/adminPanel";
import ArtistRoom from "../artistRooms/artistRoom";
import Layout from "./layout";
import StreamGate from "./streamGate";
import { Unsubscribe } from "firebase/auth";
import { useAdminStore } from "../../stores/adminStore";
import { useRoomStore } from "../../stores/roomStore";
import useStickerCDNStore from "../../stores/stickerStore";
import { useUserStore } from "../../stores/userStore";

const Room: React.FC<{ roomID: string; season?: number }> = ({
  roomID,
  season,
}) => {
  const changeRoom = useRoomStore(useCallback((state) => state.changeRoom, []));
  const initializeRoomStickerCDN = useStickerCDNStore(
    useCallback((state) => state.changeRoomStickers, []),
  );
  const unmountRoomStickerCDN = useStickerCDNStore(
    useCallback((s) => s.unmountRoomStickers, []),
  );
  const unsubscribeFromRoomInfo = useRef<Unsubscribe>();
  const adminForIDs = useUserStore(useCallback((s) => s.adminFor, []));
  const setIsAdmin = useAdminStore(useCallback((s) => s.setIsAdmin, []));
  const roomColor = useRoomStore(useCallback((s) => s.roomInfo?.roomColor, []));
  const displayName = useUserStore(useCallback((s) => s.displayName, []));

  useEffect(() => {
    async function subscribeToRoomInfo() {
      if (roomID !== undefined) {
        if (unsubscribeFromRoomInfo.current) {
          logError(
            "Room Callback exists, having to unsubscribe before re-initializing",
          );
          unsubscribeFromRoomInfo.current();
        }
        logCallbackSetup(`RoomInfo ${roomID}`);
        unsubscribeFromRoomInfo.current = await syncRoomInfoDB(roomID, (r) =>
          changeRoom(roomID as string, r),
        );
        //TODO: This is a weird place to do this, it should be after the gate.. but its okay for now.
        initializeRoomStickerCDN(roomID);
        console.log({ adminForIDs, roomID });
        if (adminForIDs && roomID && adminForIDs.includes(roomID)) {
          logInfo("You are admin for this room");
          setIsAdmin(true);
        } else {
          logInfo("You are not admin for this room");
          setIsAdmin(false);
        }
      }
    }
    subscribeToRoomInfo();
    return () => {
      logCallbackDestroyed(`RoomInfo ${roomID}`);
      unmountRoomStickerCDN();
      if (unsubscribeFromRoomInfo.current) unsubscribeFromRoomInfo.current();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomID]);

  useEffect(() => {
    if (displayName && roomID) {
      setUserPresenceHeartbeat(displayName, roomID);
    }
    return () => {
      // Clear the active timeout when unmounting or changing rooms
      if (activePresenceHeartbeat) {
        clearTimeout(activePresenceHeartbeat);
      }
    };
  }, [displayName, roomID]);

  return (
    <Layout roomColor={roomColor}>
      <RoomNameGate id={roomID as string}>
        <StreamGate>
          {(rtmpsDetails: RtmpsDetails | null) => (
            <>
              <AdminPanel rtmpsDetails={rtmpsDetails} />
              <RoomStatusGate>
                <ArtistRoom roomID={roomID} />
              </RoomStatusGate>
            </>
          )}
        </StreamGate>
      </RoomNameGate>
    </Layout>
  );
};

export default Room;
