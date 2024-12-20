import ReactPlayer from "react-player";

import { useEffect, useMemo } from "react";

import { logVideo } from "../../lib/logger";
import { generateStreamLink } from "../../lib/server-api";
import StreamPlayer from "./streamPlayer";

const VideoPreview: React.FC<{
  iLink: RoomSummary;
  localMuted: boolean;
  isTest: boolean;
}> = ({ iLink, localMuted, isTest }) => {
  const streamLink = useMemo(() => {
    if (isTest) {
      return "https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8";
    }
    return iLink.streamPlaybackID
      ? generateStreamLink(iLink.streamPlaybackID)
      : undefined;
  }, [iLink.streamPlaybackID, isTest]);

  useEffect(() => {
    if (streamLink) logVideo(iLink.roomName, streamLink);
  }, [iLink.roomName, streamLink]);

  if (!isTest && iLink.streamPlaybackID) {
    return (
      <div
        className="videoAspectContainer"
        style={{ width: "302px", height: "169px" }}
      >
        <StreamPlayer muted={true} fullscreen={false} />
      </div>
    );
  } else if (isTest) {
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
  } else {
    return <div></div>;
  }
};

export default VideoPreview;
