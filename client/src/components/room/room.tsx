
import { useCallback, useEffect,  useMemo,  useRef } from "react";
import { useRoomStore } from "../../stores/roomStore";
import { syncRoomInfoDB } from "../../lib/firestore";
import { Unsubscribe } from "firebase/auth";
import RoomNameGate, { RoomStatusGate } from "./roomGate";
import useStickerCDNStore from "../../stores/stickerStore";
import Layout from "./layout";
import { logCallbackDestroyed, logCallbackSetup, logError, logInfo } from "../../lib/logger";
import ArtistRoom from "../artistRooms/artistRoom";
import { useUserStore } from "../../stores/userStore";
import { useAdminStore } from "../../stores/adminStore";

const Room: React.FC<{ roomID: string; season?: number}> = ({ roomID, season }) => {
  const changeRoom = useRoomStore(useCallback((state) => state.changeRoom, []));
  const initializeRoomStickerCDN = useStickerCDNStore(useCallback((state) => state.changeRoomStickers, []));
  const unmountRoomStickerCDN = useStickerCDNStore(useCallback((s) => s.unmountRoomStickers, []));
  const unsubscribeFromRoomInfo = useRef<Unsubscribe>();
  const adminForIDs = useUserStore(useCallback((s) => s.adminFor, []));
  const setIsAdmin = useAdminStore(useCallback((s) => s.setIsAdmin, []));


  useEffect(() => {
    async function subscribeToRoomInfo() {
      if (roomID !== undefined) {
        if (unsubscribeFromRoomInfo.current) {
          logError("Room Callback exists, having to unsubscribe before re-initializing");
          unsubscribeFromRoomInfo.current();
        }
        logCallbackSetup(`RoomInfo ${roomID}`);
        unsubscribeFromRoomInfo.current = await syncRoomInfoDB(roomID, (r) => changeRoom(roomID as string, r));
        //TODO: This is a weird place to do this, it should be after the gate.. but its okay for now.
        initializeRoomStickerCDN(roomID);
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



  return (
    <Layout>
    <RoomNameGate id={roomID as string}>
      <RoomStatusGate>
        <ArtistRoom roomID={roomID} />
      </RoomStatusGate>
    </RoomNameGate>
    </Layout>
  );
};


export default Room;
