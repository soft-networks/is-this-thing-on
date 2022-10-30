import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { generateStreamLink } from "../lib/server-api";
import { useRoomStore } from "../stores/roomStore";

const DEFAULT_CLASSNAME = "fullWidth";
const DEFAULT_STYLE = {};

const VideoPlayer: React.FunctionComponent<
  RoomUIProps & { urlOverride?: string; streamPlaybackID?: string; muteOverride?: boolean }
> = ({ className = DEFAULT_CLASSNAME, style = DEFAULT_STYLE, streamPlaybackID, urlOverride, muteOverride }) => {
  const roomInfo = useRoomStore((state) => state.roomInfo);
  const [mute, setMuted] = useState(true);
  const globalClick = useRef<boolean>(false);

  const clickCallback = useCallback(() => {
    if (mute && !muteOverride) {
      setMuted(false);
      globalClick.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!globalClick.current) window.addEventListener("click", clickCallback);
    return () =>  window.removeEventListener("click", clickCallback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={className} style={style}>
      {streamPlaybackID || urlOverride ? (
        <ReactPlayer
          url={
            urlOverride ||
            (streamPlaybackID && generateStreamLink(streamPlaybackID)) ||
            "https://www.youtube.com/watch?v=VhR4hGUd4Lc"
          }
          muted={muteOverride !== undefined ? muteOverride : mute}
          playing={true}
          loop={true}
          height="100%"
          width="auto"
          className="noEvents"
        />
      ) : null}
    </div>
  );
};

export default VideoPlayer;
