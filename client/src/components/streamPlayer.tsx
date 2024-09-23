import {
  Call,
  ParticipantView,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  User,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { logError, logInfo } from "../lib/logger";
import { useEffect, useState } from "react";

const user: User = { type: "anonymous" };

interface VideoPlayerProps {
  muted: boolean;
  streamCallId: string;
}

const StreamPlayer: React.FunctionComponent<VideoPlayerProps> = ({
  muted,
  streamCallId,
}) => {
  const [state, setState] = useState<{
    client: StreamVideoClient;
    call: Call;
  }>();

  useEffect(() => {
    const myClient = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
      user,
    });
    const myCall = myClient.call("livestream", streamCallId);

    // myCall
    //   .get()
    //   .then(() => {
    //     logInfo("Setting state for call ID " + streamCallId);
    setState({ client: myClient, call: myCall });
    // })
    // .catch((e) => logError("Failed to retrieve call details", e));
  }, [streamCallId]);

  useEffect(() => {
    if (!state) {
      return;
    }

    state.call
      .join()
      .then(() => {})
      .catch((e) => {
        logError("Failed to join call", e);
      });

    return () => {
      state.call.leave().catch((e) => {
        logError("Failed to leave call", e);
      });
      setState(undefined);
    };
  }, [state]);

  if (!state || !state.client || !state.call) return null;

  return (
    <StreamVideo client={state.client}>
      <StreamCall call={state.call}>
        <LivestreamView muted={muted} />
      </StreamCall>
    </StreamVideo>
  );
};

const LivestreamView = ({ muted }: { muted: boolean }) => {
  const { useIsCallLive, useParticipants } = useCallStateHooks();
  const isLive = useIsCallLive();

  const participants = useParticipants();
  const VIDEO = 2;
  const liveParticipants = participants.filter((p) =>
    p.publishedTracks.includes(VIDEO),
  );

  console.log({ isLive, participants, liveParticipants });

  return isLive && liveParticipants.length > 0 ? (
    <ParticipantView
      participant={liveParticipants[0]}
      muteAudio={muted}
      className="noEvents videoAspectElement stream-player"
    />
  ) : (
    <div className="center:absolute whiteFill border padded:s1 highestLayer">
      no video yet
    </div>
  );
};

export default StreamPlayer;
