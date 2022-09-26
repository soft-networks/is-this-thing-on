
import { useCallback, useMemo } from "react";
import useRingStore from "../stores/ringStore";
import { useRoomStore } from "../stores/roomStore";

const loadingDiv = <div className="center:absolute highest"> loading...</div>;

const RoomGate: React.FunctionComponent<{ id: string }> = ({ id, children }) => {
  const ring = useRingStore(useCallback(room => room.links, []));
  const gate = useMemo(() => {    
    if (ring == undefined || Object.keys(ring).length == 0) {
      return loadingDiv;
    }
    const streamNames = Object.keys(ring);
    console.log(ring, id);
    return streamNames.includes(id) ? <> {children} </> : <div> Sorry, thats not a valid stream name </div>;
  }, [ring, id, children]);
  return gate;
};

export const RoomOnlineGate: React.FunctionComponent = ({children}) => {
  const roomInfo = useRoomStore(useCallback((s) => s.roomInfo, []));
  const roomOnline = useMemo(() => {
    if (!roomInfo) {
      return loadingDiv
    }
    return roomInfo.streamStatus == "active" ? <>{children}</> : <div className="center:absolute highest"> offline... for now</div>
  },[children, roomInfo]);
  return roomOnline
}

export default RoomGate;
