import { useCallback, useEffect, useRef } from "react";
import useGlobalRoomsInfoStore from "../../stores/globalRoomsInfoStore";
import { Unsubscribe } from "firebase/firestore";
import { logCallbackDestroyed, logCallbackSetup, logInfo } from "../../lib/logger";
import { syncAllRoomsSummary } from "../../lib/firestore";


const GlobalRoomsSummaryProvider: React.FC = ({ children }) => {
    const initializeRing = useGlobalRoomsInfoStore(useCallback((s) => s.initializeRing, []));
    const updateRingStatus = useGlobalRoomsInfoStore(useCallback((s) => s.updateRoomInfo, []));
    const onRoomCreatedOrDestroyed = useGlobalRoomsInfoStore(useCallback((s) => s.onRoomCreatedOrDestroyed, []));
    const ringUnsubs = useRef<Unsubscribe[]>();
    const numRooms = useGlobalRoomsInfoStore(useCallback((s) => Object.keys(s.rooms).length, []));

    useEffect(() => {
        async function setupSync() {
            logCallbackSetup("🌎 Mounting RingSyncs");
            ringUnsubs.current = await syncAllRoomsSummary(initializeRing,  updateRingStatus, onRoomCreatedOrDestroyed);
        }
        setupSync();
        return () => {
            logCallbackDestroyed("UnmountingRingSyncs");
            ringUnsubs.current && ringUnsubs.current.forEach((u) => u());
        };
    }, []);

    return <>{children}</>;
}

export default GlobalRoomsSummaryProvider;