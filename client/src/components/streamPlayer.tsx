import {
  Call,
  ParticipantView,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  User,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

import ReactPlayer from "react-player";
import { logError } from "../lib/logger";

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
    setState({ client: myClient, call: myCall });
  }, []);

  // useEffect(() => {
  //   if (!state) {
  //     return;
  //   }

  //   state.call
  //     .join()
  //     .then(() => {})
  //     .catch((e) => {
  //       logError("Failed to join call", e);
  //     });

  //   return () => {
  //     state.call.leave().catch((e) => {
  //       logError("Failed to leave call", e);
  //     });
  //     setState(undefined);
  //   };
  // }, [state]);

  if (!state || !state.client || !state.call) return null;

  return (
    <StreamCall call={state.call}>
      <HlsView muted={muted} />
    </StreamCall>
  );
  // return (
  //   <StreamVideo client={state.client}>
  //     <StreamCall call={state.call}>
  //       <LivestreamView muted={muted} />
  //     </StreamCall>
  //   </StreamVideo>
  // );
};

const HlsView = ({ muted }: { muted: boolean }) => {
  const { useCallEgress } = useCallStateHooks();
  const egress = useCallEgress();
  const m3u8Playlist =
    "https://ohio.stream-io-cdn.com/1330334/video/hls/livestream_livestream_c3b7a7d3-0aeb-428f-aa96-163ad4b5b086/f2c2eeb2-58c4-4cb5-be2d-159a6c007e39/playlist_1724096591873915056.m3u8?Expires=1724701391&Signature=Vl~odGF~39NV9T3kipIk9SpOCK6luwTdqb7ioo7cNrb0pjdb2WAAqgnl1uXePnYdpqowLm2GkVjsZ-QMMw7KHU-~mUYpwZTvJhSq6~qTJJ1i5Sd6BxosqdkOjrYPVSw3Rm7Lxzyb~yopde7QfqY64RiOuDp0e5vvp5ULhR6S36aW1wvOlapvuxwx1AavBGBYpphZDqe7kAzoBxWAM11UodzyJFO1zMUcese4Otam3kVuNZgmhHaMFc3qMnUxsvqKR6e5fakLd2PQq45kb~JUWxTxWBVUhC9V5u2-ulInHe2gw1ydO7u30EhAOG0oz4Q6kkQiBWR2dr7KjH3eGXMOqw__&Key-Pair-Id=APKAIHG36VEWPDULE23Q"; // egress?.hls?.playlist_url;

  console.log({ egress });

  return (
    <div className="videoAspectElement">
      <ReactPlayer
        url={m3u8Playlist}
        playing={true}
        muted={muted}
        className="noEvents testPlayer "
        height={"inherit"}
        width={"inherit"}
      />
    </div>
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

  return isLive && liveParticipants.length > 0 ? (
    <ParticipantView
      participant={liveParticipants[0]}
      muteAudio={muted}
      className="noEvents videoAspectElement stream-player"
    />
  ) : (
    <div>offline</div>
  );
};

export default StreamPlayer;
