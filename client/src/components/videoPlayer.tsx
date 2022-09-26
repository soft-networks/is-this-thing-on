import ReactPlayer from "react-player";
import { generateStreamLink } from "../lib/server-api";
import { useRoomStore } from "../stores/roomStore";

const DEFAULT_CLASSNAME = "fullWidth";
const DEFAULT_STYLE = {};

const VideoPlayer: React.FunctionComponent<RoomUIProps> = ({
  className = DEFAULT_CLASSNAME,
  style = DEFAULT_STYLE,
}) => {
  const roomInfo = useRoomStore((state) => state.roomInfo);

  return (
    <div className={className} style={style}>
      {roomInfo && roomInfo.streamStatus == "active" && roomInfo.streamPlaybackID ? (
        <ReactPlayer
          url={generateStreamLink(roomInfo.streamPlaybackID)}
          muted={true}
          controls={false}
          playing={true}
          width="100%"
          height="100%"
        />
      ) : (
        null && <ReactPlayer
          muted={true}
          controls={false}
          playing={true}
          url={"https://www.youtube.com/watch?v=q55qNEKQLG0"}
          width="100%"
          height="100%"
        />
      )}
    </div>
  );
};

export default VideoPlayer;
