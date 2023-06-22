import MuxPlayer from "@mux/mux-player-react";

const VideoPreview: React.FC<{ iLink: RoomLinkInfo; localMuted: boolean }> = ({ iLink, localMuted }) => {
  return (
    <MuxPlayer
      playbackId={iLink.streamPlaybackID}
      autoPlay
      muted={true}
      className="noEvents"
      style={iLink.roomID == "chrisy" ? { width: "200%", height: "auto" } : { height: "100%", width: "auto" }}
    />
  );
};

export default VideoPreview;