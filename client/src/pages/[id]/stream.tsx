import {
  Call,
  ParticipantView,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { getRoomsWhereUserISAdmin } from "../../lib/firestore";
import { logError, logInfo } from "../../lib/logger";
import { getStreamAdminCredentials } from "../../lib/server-api";
import { useUserStore } from "../../stores/userStore";

interface StreamConfig {
  apiKey: string;
  userId: string;
}

const StreamLive = () => {
  const router = useRouter();
  const [roomInfo, setRoomInfo] = useState<{
    info?: RoomInfo;
    isLoading: boolean;
  }>({
    isLoading: true,
  });

  const currentUser = useUserStore(
    useCallback((state) => state.currentUser, []),
  );

  useEffect(() => {
    if (!currentUser || !router.query.id) {
      return;
    }

    getRoomsWhereUserISAdmin(currentUser.uid).then((rooms) => {
      setRoomInfo({
        info: rooms?.find((room) => room.roomID === router.query.id),
        isLoading: false,
      });
    });
  }, [router.query, currentUser]);

  if (!router.query.id || typeof router.query.id !== "string") {
    return (
      <div className="fullBleed center:children">
        <p>something went wrong</p>
      </div>
    );
  }
  console.log({ roomInfo });
  if (roomInfo.isLoading) {
    return (
      <div className="fullBleed center:children">
        <p>Loading room info...</p>
      </div>
    );
  } else if (!roomInfo.info) {
    return (
      <div className="fullBleed center:children">
        <p>oops! you're lost.</p>
      </div>
    );
  } else {
    return (
      <AdminStreamPanel streamPlaybackID={roomInfo.info.streamPlaybackID} />
    );
  }
};

const AdminStreamPanel: React.FC<{ streamPlaybackID: string | undefined }> = ({
  streamPlaybackID,
}) => {
  const [state, setState] = useState<{
    client: StreamVideoClient;
    call: Call;
  }>();

  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (state) {
      return;
    }

    const config: StreamConfig = {
      apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
      userId: process.env.NEXT_PUBLIC_STREAM_ADMIN_USER_ID!,
    };

    // TODO: error handling
    getStreamAdminCredentials()
      .then((creds) => {
        const myClient = new StreamVideoClient({
          user: { id: creds.userId, name: "Admin" },
          apiKey: config.apiKey,
          token: creds.token,
        });

        const streamId = streamPlaybackID || crypto.randomUUID();
        logInfo(`Generated new livestream with ID ${streamId}`);
        const myCall = myClient.call("livestream", streamId);
        setState({ client: myClient, call: myCall });
      })
      .catch((err: Error) => {
        logError(err);
        setError(err);
      });
  }, []);

  useEffect(() => {
    if (!state) {
      return;
    }
    console.log("creating or rejoining call");
    state.call
      .join({ create: true })
      .then()
      .catch((e: Error) => {
        console.error("Failed to join call", e);
        setError(e);
      });

    console.log(state.call);

    return () => {
      state.call.leave().catch((e) => {
        console.error("Failed to leave call", e);
      });
      setState(undefined);
    };
  }, [state]);

  if (error) {
    return <div className="center:absolute">{error.message}</div>;
  }

  if (!state || !state.client || !state.call)
    return (
      <div className="fullBleed center:children">
        <p>Loading...</p>
      </div>
    );

  return (
    <StreamVideo client={state.client}>
      <StreamCall call={state.call}>
        <LivestreamView call={state.call} />
      </StreamCall>
    </StreamVideo>
  );
};

const LivestreamView = ({ call }: { call: Call }) => {
  const { useCameraState, useMicrophoneState, useIsCallLive, useParticipants } =
    useCallStateHooks();

  const { camera: cam, isEnabled: isCamEnabled } = useCameraState();
  const { microphone: mic, isEnabled: isMicEnabled } = useMicrophoneState();

  const isLive = useIsCallLive();

  const participants = useParticipants();
  const VIDEO = 2;
  const liveParticipants = participants.filter((p) =>
    p.publishedTracks.includes(VIDEO),
  );
  console.log({ participants, liveParticipants });

  return (
    <div className="fullBleed center:children">
      {liveParticipants.length > 0 ? (
        <ParticipantView
          participant={liveParticipants[0]}
          ParticipantViewUI={null}
        />
      ) : (
        <div>Attempting to join the livestream as host...</div>
      )}
      <div style={{ display: "flex", gap: "4px" }}>
        <button onClick={() => (isLive ? call.stopLive() : call.goLive())}>
          {isLive ? "Stop Live" : "Go Live"}
        </button>
        <button onClick={() => cam.toggle()}>
          {isCamEnabled ? "Disable camera" : "Enable camera"}
        </button>
        <button onClick={() => mic.toggle()}>
          {isMicEnabled ? "Mute Mic" : "Unmute Mic"}
        </button>
      </div>
    </div>
  );
};

export default StreamLive;
