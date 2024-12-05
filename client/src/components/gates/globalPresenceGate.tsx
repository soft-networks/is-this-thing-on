import { useEffect } from "react";
import { useCallback } from "react";
import { useRoomStore } from "../../stores/currentRoomStore";
import { useGlobalUserStore } from "../../stores/globalUserStore";
import { activePresenceHeartbeat, setUserPresenceHeartbeat } from "../../lib/firestore";


/* Note that this is a gate that has a weird pattern. It exists at the global context, but it USING one of the room contexts. It all works, since we're using global stores but it's odd */
const GlobalPresenceGate: React.FC = ({children}) => {
    const displayName = useGlobalUserStore(useCallback((s) => s.displayName, []));
    const roomID = useRoomStore(useCallback((s) => s.roomInfo?.roomID, []));
    
    useEffect(() => {
        const presenceID = roomID ? roomID : "home";
        console.log("Reseting presence heartbeat", displayName, presenceID);

        if (displayName && presenceID) {
          setUserPresenceHeartbeat(displayName, presenceID);
        }
        return () => {
          // Clear the active timeout when unmounting or changing rooms
          if (activePresenceHeartbeat) {
            clearTimeout(activePresenceHeartbeat);
          }
        };
      }, [displayName, roomID]);
    
    return <>{children}</>
}

export default GlobalPresenceGate;