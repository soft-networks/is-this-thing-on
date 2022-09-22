
import { useCallback, useMemo } from "react";
import useRingStore from "../stores/ringStore";

const RoomGate: React.FunctionComponent<{ id: string }> = ({ id, children }) => {
  const ring = useRingStore(useCallback(room => room.links, []));
  const gate = useMemo(() => {    
    const streamNames = Object.keys(ring);
    console.log(ring, id);
    return streamNames.includes(id) ? <> {children} </> : <div> Sorry, thats not a valid stream name </div>;
  }, [ring, id, children]);
  return gate;
};

export default RoomGate;
