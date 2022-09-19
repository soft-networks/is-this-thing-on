import classnames from "classnames";
import { useCallback, useEffect, useState } from "react";
import { useRoomStore } from "../stores/roomStore";

const RoomEnergy: React.FC = () => {
  const roomID = useRoomStore(useCallback(state => state.currentRoomID, []));
  const roomEnergy = useRoomStore(useCallback( state => state.roomInfo?.energy,[]));
  const [justUpdated, setJustUpdated] = useState<boolean>();
  useEffect(() => {
    setJustUpdated(true);
    setTimeout(() => setJustUpdated(false), 3000);

  }, [roomEnergy]);
  return roomID  ? <div className={classnames("whiteFill border padded:s-2", { fadeContrast: justUpdated })}> {roomEnergy} NRG </div> : null
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
