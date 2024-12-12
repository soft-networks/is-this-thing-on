import { useCallback, useEffect } from "react";
import {
  activePresenceHeartbeat,
  setUserPresenceHeartbeat,
} from "../lib/firestore";
import { useRoomStore } from "../stores/currentRoomStore";
import { useGlobalUserStore } from "../stores/globalUserStore";
import AdminPanel from "./account/adminPanel";
import ArtistRoom from "./artistRooms/artistRoom";
import RoomStatusGate from "./gates/roomStatusGate";
import RoomExistsGate from "./gates/roomExistsGate";
import StreamGate from "./gates/streamGate";
import RoomProvider from "./gates/roomProvider";

const Room: React.FC<{ roomID: string }> = ({
  roomID
}) => {
  const roomPlaybackId = useRoomStore(
    useCallback((s) => s.roomInfo?.streamPlaybackID, []),
  );
  const displayName = useGlobalUserStore(useCallback((s) => s.displayName, []));
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
    <RoomExistsGate id={roomID as string}>
      <RoomProvider roomID={roomID}>
        <StreamGate
          roomID={roomID}
          streamPlaybackID={roomPlaybackId}
          anonymousOnly={false}
        >
          {(rtmpsDetails: RtmpsDetails | null) => (
            <>
              <AdminPanel rtmpsDetails={rtmpsDetails} />
              <RoomStatusGate>
                <ArtistRoom roomID={roomID} />
              </RoomStatusGate>
            </>
          )}
        </StreamGate>
      </RoomProvider>
    </RoomExistsGate>
  );
};

export default Room;
