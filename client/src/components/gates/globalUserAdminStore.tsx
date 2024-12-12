import { useCallback } from "react";
import { useEffect } from "react";
import { useGlobalAdminStore } from "../../stores/globalUserAdminStore";
import { useGlobalUserStore } from "../../stores/globalUserStore";
import useGlobalRoomsInfoStore from "../../stores/globalRoomsInfoStore";
import { getRoomsWhereUserISAdmin } from "../../lib/firestore";


const GlobalUserAdminProvider: React.FC = ({children}) => {
  
  const setAdminFor = useGlobalAdminStore(useCallback((s) => s.setAdminFor, []));
  const userID = useGlobalUserStore(useCallback((s) => s.currentUser?.uid, []));
  const numRooms = useGlobalRoomsInfoStore(useCallback((s) => Object.keys(s.rooms).length, []));

  const refreshAdminFor = useCallback(async () => {
    if (!userID) return;
    console.log("refreshing adminFor....");
    let rooms = await getRoomsWhereUserISAdmin(userID);
    if (rooms) {
      setAdminFor(rooms.map((r) => r.roomID));
    }
  }, [userID, setAdminFor]);

  useEffect(() => {
    refreshAdminFor();
  }, [refreshAdminFor]);

  useEffect(() => {
    refreshAdminFor();
  }, [numRooms]);


  return <>{children}</>;
}

export default GlobalUserAdminProvider; 