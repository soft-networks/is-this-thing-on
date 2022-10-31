import classnames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRoomStore } from "../stores/roomStore";

const RoomEnergy: React.FC<{roomID: string}> = ({roomID}) => {
  const roomEnergy = useRoomStore(useCallback( state => state.roomInfo?.energy,[]));
  const [justUpdated, setJustUpdated] = useState<boolean>();
  const timeout = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    setJustUpdated(true);
    timeout.current = setTimeout(() => setJustUpdated(false), 3000);
    return () => timeout.current && clearTimeout(timeout.current);
  }, [roomEnergy]);
  return roomID  ? <div className={classnames("lightFill border padded:s-2", { fadeContrast: justUpdated })}> {roomEnergy} NRG </div> : null
}

const RoomInfoViewer: React.FunctionComponent = () => {
  const roomInfo = useRoomStore((state) => state.roomInfo);
  return (
    <div>
      <p>
        {roomInfo?.roomName} is .. {roomInfo?.streamStatus}{" "}
      </p>
      <p> {roomInfo?.numOnline} people online.</p>
    </div>
  );
};

export default RoomInfoViewer;
export {RoomEnergy};
