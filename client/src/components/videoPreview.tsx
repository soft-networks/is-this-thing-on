import ReactPlayer from "react-player";
import { generateStreamLink } from "../lib/server-api";
import { useEffect, useMemo } from "react";
import { logVideo } from "../lib/logger";

const VideoPreview: React.FC<{ iLink: RoomLinkInfo; localMuted: boolean }> = ({ iLink, localMuted }) => {

  const streamLink = useMemo(
    () => (iLink.streamPlaybackID ? generateStreamLink(iLink.streamPlaybackID) : undefined),
    [iLink.streamPlaybackID]
  );
  useEffect(() => {
    if (streamLink) logVideo(iLink.roomName, streamLink);
  }, [iLink.roomName, streamLink]);
  
  return (
    streamLink ? <ReactPlayer
      url={streamLink}
      playing={true}
      muted={localMuted}
      style={{ width: "100%", height: "100%" }}
      className="noEvents fullBleed videoAspect"
      width={"100%"}
      height={"100%"}
    /> : <div></div>
  );
};

export default VideoPreview;
