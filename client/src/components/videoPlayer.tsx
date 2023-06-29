import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRoomStore } from "../stores/roomStore";
import MuxPlayer from "@mux/mux-player-react/lazy";
import { logError, logVideo } from "../lib/logger";
import { generateStreamLink } from "../lib/server-api";

const DEFAULT_CLASSNAME = "fullWidth";
const DEFAULT_STYLE = {} as React.CSSProperties;
const DEFAULT_VIDEO_STYLE = { height: "100%", width: "auto" };
interface VideoPlayerProps {
  streamPlaybackID?: string;
  muteOverride?: boolean;
  hideMuteButton?: boolean;
}
const VideoPlayer: React.FunctionComponent<VideoPlayerProps> = ({
  hideMuteButton,
}) => {
  const [mute, setMuted] = useState(false);
  const streamPlaybackID = useRoomStore(useCallback((s) => s.roomInfo?.streamPlaybackID, []));
  useEffect(() => {
    streamPlaybackID && logVideo(` stream: `, generateStreamLink(streamPlaybackID));
  }, [streamPlaybackID]);
  return streamPlaybackID ? (
    <div className="fullBleed" key="videoPlayer">
      {!hideMuteButton && (
        <div className="higherThanStickerLayer padded" style={{ position: "fixed", top: "0px", right: "0px" }}>
          <div
            className="border-thin whiteFill padded:s-2 clickable contrastFill:hover"
            onClick={() => setMuted(!mute)}
          >
            {mute ? "play audio" : "mute audio"}
          </div>
        </div>
      )}
      <div className="baseLayer fullBleed center:children">
        <MuxPlayer
          playbackId={streamPlaybackID}
          autoPlay={"any"}
          muted={mute}
          className="noEvents videoAspect muxPlayer"
          nohotkeys={true}
          onError={(e) => logError(e)}
        />
      </div>
    </div>
  ) : (
    <div></div>
  );
};

export default VideoPlayer;
