import ReactPlayer from "react-player";
import { generateStreamLink } from "../lib/server-api";
import { useRoomStore } from "../stores/roomStore";

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
