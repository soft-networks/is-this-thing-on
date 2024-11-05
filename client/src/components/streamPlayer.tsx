import {
  Call,
  ParticipantView,
  StatCardExplanation,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  User,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { logError, logInfo } from "../lib/logger";
import { useCallback, useEffect, useState } from "react";

import { getStreamAdminCredentials } from "../lib/server-api";
import { useAdminStore } from "../stores/adminStore";

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
    console.log("YES VIDEOa");
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
    console.log("NO VIDEO");
    return (
      <div className="center:absolute whiteFill border padded:s1 highestLayer">
        no video yet
      </div>
    );
  }
};

export default StreamPlayer;
