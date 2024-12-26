import { useCallback, useEffect, useRef } from "react";
import { useRoomStore } from "../../stores/currentRoomStore";
import { logCallbackDestroyed, logCallbackSetup, logInfo } from "../../lib/logger";
import { Unsubscribe } from "firebase/firestore";
import { logError } from "../../lib/logger";
import { syncRoomInfoDB} from "../../lib/firestore";
import useStickerCDNStore from "../../stores/stickerStore";
import { useGlobalAdminStore } from "../../stores/globalUserAdminStore";
import { useGlobalUserStore } from "../../stores/globalUserStore";

const RoomProvider: React.FC<{roomID: string}> = ({ roomID, children }) => {

    const roomStore = useRoomStore(useCallback((s) => s, []));
    // const stickerStore = useStickerCDNStore(useCallback((s) => s, []));
    // const adminForIDs = useGlobalAdminStore(useCallback((s) => s.adminFor, []));
    const setIsAdmin = useGlobalAdminStore(useCallback((s) => s.setIsAdmin, []));
    const unsubscribeFromRoomInfo = useRef<Unsubscribe>();



    useEffect(() => {
        async function subscribeToRoomInfo() {
          if (roomID !== undefined) {
            if (unsubscribeFromRoomInfo.current) {
              logError(
                "Room Callback exists, having to unsubscribe before re-initializing",
              );
              unsubscribeFromRoomInfo.current();
            }
            logCallbackSetup(`**** Navigating into ${roomID} *****`);
            roomStore.changeRoom(roomID as string)
            unsubscribeFromRoomInfo.current = await syncRoomInfoDB(roomID, (r) => {
              roomStore.updateCurrentRoomInfo(r)
            });
            //TODO: This is a weird place to do this, it should be after the gate.. but its okay for now.
            //stickerStore.changeRoomStickers(roomID);
            const adminForIDs = useGlobalAdminStore.getState().adminFor;
            if (adminForIDs && roomID && adminForIDs.includes(roomID)) {
              logInfo("You are admin for this room", [adminForIDs, roomID]);
             setIsAdmin(true);
            } else {
              logInfo("You are not admin for this room", [adminForIDs, roomID]);
             setIsAdmin(false);
            }
          }
        }
        subscribeToRoomInfo();
        return () => {
          logCallbackDestroyed(`RoomInfo ${roomID}`);
          // stickerStore.unmountRoomStickers();
          if (unsubscribeFromRoomInfo.current) unsubscribeFromRoomInfo.current();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [roomID]);
    return <>{children}</>;
}

export default RoomProvider;