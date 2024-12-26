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
    let rooms = await getRoomsWhereUserISAdmin(userID);
    if (rooms) {
      setAdminFor(rooms);
    }
  }, [userID, setAdminFor]);

  useEffect(() => {
    refreshAdminFor();
  }, []);

  useEffect(() => {
    refreshAdminFor();
  }, [numRooms]);


  return <>{children}</>;
}

export default GlobalUserAdminProvider; 