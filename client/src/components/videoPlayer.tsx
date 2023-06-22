import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useRoomStore } from "../stores/roomStore";


const DEFAULT_CLASSNAME = "fullWidth";
const DEFAULT_STYLE = {} as React.CSSProperties;
const DEFAULT_VIDEO_STYLE = {height: "100%", width: "auto"};

type VideoPlayerProps = RoomUIProps & { videoStyle?: React.CSSProperties, urlOverride?: string; streamPlaybackID?: string; muteOverride?: boolean, hideMuteButton?: boolean }

const VideoPlayer: React.FunctionComponent<VideoPlayerProps> = ({
  className = DEFAULT_CLASSNAME,
  style = DEFAULT_STYLE,
  videoStyle ,  
  urlOverride,
  muteOverride,
  hideMuteButton
}) => {
  const [mute, setMuted] = useState(false);
  const globalClick = useRef<boolean>(false);
  const streamPlaybackID = useRoomStore(useCallback((s) => s.roomInfo?.streamPlaybackID, []));

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

  const player = useMemo(() => {
    let shouldMute = muteOverride !== undefined ? muteOverride : mute;
    if (urlOverride) {
      <ReactPlayer
      url={
        urlOverride || "https://www.youtube.com/watch?v=VhR4hGUd4Lc"
      }
      muted={shouldMute}
      playing={true}
      loop={true}
      height={(videoStyle || DEFAULT_VIDEO_STYLE).height}
      width={(videoStyle || DEFAULT_VIDEO_STYLE).width}
      className="noEvents"
    />
    }
    if (streamPlaybackID) {
      return (
        <ReactPlayer
        url={
          `https://stream.mux.com/${streamPlaybackID}.m3u8`
        }
          autoPlay
          muted={shouldMute}
          style={videoStyle || DEFAULT_VIDEO_STYLE}
          className="noEvents fullBleed"
          width={"100%"}
          height={"100%"}
        />
      );
    } 
    return null;
  }, [mute, muteOverride, streamPlaybackID, urlOverride, videoStyle])
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
        {player}
      </div>
    </>
  ) : null;
};

export default VideoPlayer;
