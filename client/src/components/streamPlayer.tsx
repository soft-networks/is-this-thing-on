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

  // Enforce syncing on the call object to ensure the stream liveness is updated.
  // Without this, there are two major issues:
  //
  // 1. If a viewer joins the room before the stream is live, their page will not be automatically updated with video/audio when the stream goes live.
  // 2. If a viewer is in the room when the stream goes from live --> stopped, BUT there's an issue with updating the room status in Firestore,
  //    they will continue to see the streamer's camera and audio even though the Stream is in "backstage mode".
  //
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
