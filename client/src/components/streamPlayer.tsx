import {
  ParticipantView,
  User,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

const user: User = { type: "anonymous" };

interface VideoPlayerProps {
  muted: boolean;
  fullscreen: boolean;
}

const StreamPlayer: React.FunctionComponent<VideoPlayerProps> = ({
  muted,
  fullscreen,
}) => {
  return <LivestreamView muted={muted} fullscreen={fullscreen} />;
};

const LivestreamView = ({
  muted,
  fullscreen,
}: {
  muted: boolean;
  fullscreen: boolean;
}) => {
  const { useIsCallLive, useParticipants } = useCallStateHooks();
  const isLive = useIsCallLive();

  const participants = useParticipants();
  const VIDEO = 2;
  const liveParticipants = participants.filter((p) =>
    p.publishedTracks.includes(VIDEO),
  );

  console.log({ isLive, participants, liveParticipants });

  if (isLive && liveParticipants.length > 0) {
    return (
      <>
        <ParticipantView
          participant={liveParticipants[0]}
          muteAudio={muted}
          className={`noEvents stream-player ${fullscreen ? "videoAspectElement" : "streamPreviewAspectElement"}`}
        />
      </>
    );
  } else {
    return (
      <div className="center:absolute whiteFill border padded:s1 highestLayer">
        no video yet
      </div>
    );
  }
};

export default StreamPlayer;
