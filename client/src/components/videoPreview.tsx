import ReactPlayer from "react-player";
import { generateStreamLink } from "../lib/server-api";

const VideoPreview: React.FC<{ iLink: RoomLinkInfo; localMuted: boolean }> = ({ iLink, localMuted }) => {
  return (
    iLink.streamPlaybackID ? <ReactPlayer
      url={generateStreamLink(iLink.streamPlaybackID)}
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
