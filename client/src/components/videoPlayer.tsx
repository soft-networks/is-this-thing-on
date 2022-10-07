import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { generateStreamLink } from "../lib/server-api";
import { useRoomStore } from "../stores/roomStore";

const DEFAULT_CLASSNAME = "fullWidth";
const DEFAULT_STYLE = {};

const VideoPlayer: React.FunctionComponent<RoomUIProps & {urlOverride?: string}> = ({
  className = DEFAULT_CLASSNAME,
  style = DEFAULT_STYLE,
  urlOverride
}) => {
  const roomInfo = useRoomStore((state) => state.roomInfo);
  const [mute, setMuted] = useState(true);

  useEffect(()=> {
    window.addEventListener("click", () => setMuted(false))
  }, [])
  return (
    <div className={className} style={style}>
      { (roomInfo && roomInfo.streamStatus == "active" && roomInfo.streamPlaybackID) || (urlOverride) ? (
        <ReactPlayer
          url={urlOverride || generateStreamLink((roomInfo as RoomInfo).streamPlaybackID)}
          muted={mute}
          playing={true}
          loop={true}
          height="100%"
          width="auto"
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
