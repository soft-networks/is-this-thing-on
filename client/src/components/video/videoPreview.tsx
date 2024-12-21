import ReactPlayer from "react-player";

const TEST_VIDEO =
  "https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8";

const VideoPreview: React.FC<{
  iLink: RoomSummary;
  localMuted: boolean;
  isTest: boolean;
}> = ({ iLink, localMuted, isTest }) => {
  return !isTest && !iLink.streamHlsPlaylistID ? (
    <></>
  ) : (
    <ReactPlayer
      url={isTest ? TEST_VIDEO : iLink.streamHlsPlaylistID}
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
