import {
  Call,
  ParticipantView,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
  User,
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
  const [roomInfo, setRoomInfo] = useState<RoomInfo | undefined>();

  const currentUser = useUserStore(
    useCallback((state) => state.currentUser, []),
  );

  useEffect(() => {
    if (!currentUser || !router.query.id) {
      return;
    }

    getRoomsWhereUserISAdmin(currentUser.uid).then((rooms) => {
      setRoomInfo(rooms?.find((room) => room.roomID === router.query.id));
    });
  }, [router.query, currentUser]);

  if (!router.query.id || typeof router.query.id !== "string") {
    return <div className="fullBleed darkFill"> something went wrong </div>;
  }

  console.log({ roomInfo });

  return roomInfo ? (
    <AdminStreamPanel streamPlaybackID={roomInfo.streamPlaybackID} />
  ) : (
    <p>Access is denied.</p>
  );
};

const AdminStreamPanel: React.FC<{ streamPlaybackID: string | undefined }> = ({
  streamPlaybackID,
}) => {
  const [state, setState] = useState<{
    client: StreamVideoClient;
    call: Call;
  }>();

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
      .catch((err) => logError(err));
  }, []);

  useEffect(() => {
    if (!state) {
      return;
    }
    console.log("creating or rejoining call");
    state.call
      .join({ create: true })
      .then()
      .catch((e) => {
        console.error("Failed to join call", e);
      });

    console.log(state.call);

    return () => {
      state.call.leave().catch((e) => {
        console.error("Failed to leave call", e);
      });
      setState(undefined);
    };
  }, [state]);

  if (!state || !state.client || !state.call) return <div>{state}</div>;

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
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      {liveParticipants.length > 0 ? (
        <ParticipantView participant={liveParticipants[0]} />
      ) : (
        <div>The host hasn't joined yet</div>
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
