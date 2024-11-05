import {
  ParticipantView,
  useCall,
  useCallStateHooks,
  User,
} from "@stream-io/video-react-sdk";

import { useEffect } from "react";

const user: User = { type: "anonymous" };

interface VideoPlayerProps {
  muted: boolean;
  fullscreen: boolean;
}

const StreamPlayer: React.FunctionComponent<VideoPlayerProps> = ({
  muted,
  fullscreen,
}: {
  muted: boolean;
  fullscreen: boolean;
}) => {
  const call = useCall();
  const { useIsCallLive, useParticipants } = useCallStateHooks();
  const isLive = useIsCallLive();

  const participants = useParticipants();

  useEffect(() => {
    call?.get();
  }, [call]);

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
