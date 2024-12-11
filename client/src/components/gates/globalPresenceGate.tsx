import { useEffect } from "react";
import { useCallback } from "react";
import { useRoomStore } from "../../stores/currentRoomStore";
import { useGlobalUserStore } from "../../stores/globalUserStore";
import { activePresenceHeartbeat, setUserPresenceHeartbeat } from "../../lib/firestore";
import { useRouter } from "next/router";
import { logInfo } from "../../lib/logger";


/* Note that this is a gate that has a weird pattern. It exists at the global context, but it USING one of the room contexts. It all works, since we're using global stores but it's odd */
const GlobalPresenceGate: React.FC = ({children}) => {
    const displayName = useGlobalUserStore(useCallback((s) => s.displayName, []));
    const router = useRouter();
    const { id } = router.query;
  
    
    useEffect(() => {
        let presenceID =  "home";
        if (id && typeof id === "string") {
            presenceID = id;
        }
        logInfo("Reseting presence heartbeat due to change in room or displayname: ", [displayName, presenceID]);
        if (displayName && presenceID) {
          setUserPresenceHeartbeat(displayName, presenceID);
        }
        return () => {
          // Clear the active timeout when unmounting or changing rooms
          if (activePresenceHeartbeat) {
            logInfo("Clearing presence heartbeat", [displayName, presenceID]);
            clearTimeout(activePresenceHeartbeat);
          }
        };
      }, [displayName, id]);
    
    return <>{children}</>
}

export default GlobalPresenceGate;