import ReactPlayer from "react-player";
import { generateStreamLink } from "../lib/server-api";
import { useRoomStore } from "../stores/roomStore";


const RoomInfoViewer: React.FunctionComponent = () => {
  const roomInfo = useRoomStore(state => state.roomInfo);
  return (
    <div className="stack padded quarterWidth">
      <div>
        <p>{roomInfo?.roomName} is .. {roomInfo?.streamStatus} </p>
        <p> {roomInfo?.numOnline} people online.</p>
      </div>
      <div>
        {roomInfo && roomInfo.streamStatus == "active" && roomInfo.streamPlaybackID && (
          <ReactPlayer url={generateStreamLink(roomInfo.streamPlaybackID)} controls={true} />
        )}
      </div>
    </div>
  );
};


export default RoomInfoViewer;