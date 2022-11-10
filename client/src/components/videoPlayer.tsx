import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { generateStreamLink } from "../lib/server-api";
import { useRoomStore } from "../stores/roomStore";

const DEFAULT_CLASSNAME = "fullWidth";
const DEFAULT_STYLE = {};

type VideoPlayerProps = RoomUIProps & { urlOverride?: string; streamPlaybackID?: string; muteOverride?: boolean, hideMuteButton?: boolean }

const VideoPlayer: React.FunctionComponent<VideoPlayerProps> = ({
  className = DEFAULT_CLASSNAME,
  style = DEFAULT_STYLE,
  streamPlaybackID,
  urlOverride,
  muteOverride,
  hideMuteButton
}) => {
  const roomInfo = useRoomStore((state) => state.roomInfo);
  const [mute, setMuted] = useState(true);
  const globalClick = useRef<boolean>(false);

  const clickCallback = useCallback(() => {
    if (mute && !muteOverride) {
      setMuted(false);
      window.removeEventListener("click", clickCallback);
      globalClick.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!globalClick.current) window.addEventListener("click", clickCallback);
    return () => window.removeEventListener("click", clickCallback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return streamPlaybackID || urlOverride ? (
    <>
      {!hideMuteButton && (
        <div className="highest padded" style={{ position: "fixed", top: "0px", right: "0px" }}>
          <div
            className="border-thin whiteFill padded:s-2 clickable contrastFill:hover"
            onClick={() => setMuted(!mute)}
          >
            {mute ? "play audio" : "mute audio"}
          </div>
        </div>
      )}
      <div className={className} style={style}>
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
      </div>
    </>
  ) : null;
};

export default VideoPlayer;
