import { useEffect, useMemo } from "react";

import ReactPlayer from "react-player";
import StreamPlayer from "./streamPlayer";
import { generateStreamLink } from "../../lib/server-api";
import { logVideo } from "../../lib/logger";

const VideoPreview: React.FC<{
  iLink: RoomSummary;
  localMuted: boolean;
  isTest: boolean;
}> = ({ iLink, localMuted, isTest }) => {
  const streamLink = useMemo(() => {
    if (isTest) {
      return "https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8";
    }
    return iLink.streamHlsPlaylistID;
  }, [iLink.streamHlsPlaylistID, isTest]);

  useEffect(() => {
    if (streamLink) logVideo(iLink.roomName, streamLink);
  }, [iLink.roomName, streamLink]);

  return (
    <ReactPlayer
      url={streamLink}
      playing={true}
      muted={localMuted}
      className="noEvents "
      width={"302px"}
      height={"169px"}
      style={{ margin: "-1px" }}
    />
  );
};

export default VideoPreview;
