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
import { logError } from "../../lib/logger";
import { getStreamAdminCredentials } from "../../lib/server-api";
import { useUserStore } from "../../stores/userStore";

interface StreamConfig {
  apiKey: string;
  userId: string;
}

/**
 * This page allows room administrators to create (or rejoin) a livestream and stream their audio/video directly from the browser using WebRTC.
 * This is noticably faster than traditional RTMP.
 *
 * When this page is opened, it calls the server API to:
 *   1. Generate a short-lived Stream admin user token. This is necessary to stream from the account.
 *   2. Get or generate the Stream call ID. If the stream_playback_id is set in Firestore, we will use that; otherwise we start a new Livestream call.
 *
 */
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
    if (!currentUser || !router.query.id || !roomInfo.isLoading) {
      return;
    }

    getRoomsWhereUserISAdmin(currentUser.uid).then((rooms) => {
      setRoomInfo({
        info: rooms?.find((room) => room.roomID === router.query.id),
        isLoading: false,
      });
    });
  }, [router.query, currentUser]);

  if (roomInfo.isLoading) {
    return (
      <div className="fullBleed center:children">
        <p>Loading room info...</p>
      </div>
    );
  } else if (!roomInfo.info) {
    return (
      <div className="fullBleed center:children">
        <p>oops! ur lost.</p>
      </div>
    );
  } else {
    return <AdminStreamPanel roomID={roomInfo.info.roomID} />;
  }
};

const AdminStreamPanel: React.FC<{
  roomID: string;
}> = ({ roomID }) => {
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

    getStreamAdminCredentials(roomID)
      .then((creds) => {
        const myClient = new StreamVideoClient({
          user: { id: creds.userId, name: "Admin" },
          apiKey: config.apiKey,
          token: creds.token,
        });

        const myCall = myClient.call("livestream", creds.callId);
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

    state.call
      .join()
      .then()
      .catch((e: Error) => {
        logError(`Failed to join call: ${e}`);
        setError(e);
      });

    return () => {
      state.call.leave().catch((e) => {
        logError(`Failed to leave call: ${e}`);
      });
      setState(undefined);
    };
  }, [state]);

  if (error) {
    return <div className="fullBleed center:children">{error.message}</div>;
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
