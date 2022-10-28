import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { generateStreamLink } from "../lib/server-api";
import { useRoomStore } from "../stores/roomStore";

const DEFAULT_CLASSNAME = "fullWidth";
const DEFAULT_STYLE = {};

const VideoPlayer: React.FunctionComponent<RoomUIProps & {urlOverride?: string, streamPlaybackID?: string, muteOverride?: boolean}> = ({
  className = DEFAULT_CLASSNAME,
  style = DEFAULT_STYLE,
  streamPlaybackID,
  urlOverride,
  muteOverride
}) => {
  const roomInfo = useRoomStore((state) => state.roomInfo);
  const [mute, setMuted] = useState(true);
  useEffect(()=> {
    window.addEventListener("click", () => {
      if (mute && !muteOverride) {
        setMuted(false);
      }
  })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div
      className={className}
      style={style}
    >
      { (streamPlaybackID || urlOverride) ? <ReactPlayer
        url={urlOverride || generateStreamLink((roomInfo as RoomInfo).streamPlaybackID)}
        muted={muteOverride || mute}
        playing={true}
        loop={true}
        height="100%"
        width="auto"
        className="noEvents"
      /> : null}
    </div>
  );
};

export default VideoPlayer;
