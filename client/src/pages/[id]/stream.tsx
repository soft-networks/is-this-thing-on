import {
  Call,
  ParticipantView,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { createRef, useCallback, useEffect, useMemo, useState } from "react";

import Draggable from "react-draggable";
import classNames from "classnames";
import { getRoomsWhereUserISAdmin } from "../../lib/firestore";
import { getStreamAdminCredentials } from "../../lib/server-api";
import { logError } from "../../lib/logger";
import { useRouter } from "next/router";
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
    error?: Error;
    isLoading: boolean;
  }>({
    isLoading: true,
  });

  const currentUser = useUserStore(
    useCallback((state) => state.currentUser, []),
  );

  useEffect(() => {
    if (!router.query.id || !roomInfo.isLoading) {
      return;
    }

    if (!currentUser) {
      setRoomInfo({
        error: new Error("You must log in to visit this page."),
        isLoading: false,
      });
      return;
    }

    getRoomsWhereUserISAdmin(currentUser.uid)
      .then((rooms) => {
        setRoomInfo({
          info: rooms?.find((room) => room.roomID === router.query.id),
          isLoading: false,
        });
      })
      .catch((err) => {
        setRoomInfo({
          error: err,
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
  } else if (roomInfo.error) {
    return (
      <div className="fullBleed center:children">
        <p>{roomInfo.error.message}</p>
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

/**
 * This component is only shown after we have already verified the user as a room admin, so we can make calls using secrets
 * retrieved from the server and not worry too much about those credentials being viewable in the console.
 */
const AdminStreamPanel: React.FC<{
  roomID: string;
}> = ({ roomID }) => {
  const [state, setState] = useState<{
    client: StreamVideoClient;
    call: Call;
    rtmpAddress: string;
    rtmpStreamKey: string;
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

        const myCall = myClient.call("livestream", creds.call.id);
        console.log("CALL ID: " + creds.call.id);
        myCall
          .get()
          .then(() => {
            setState({
              client: myClient,
              call: myCall,
              rtmpAddress: creds.call.rtmpAddress,
              rtmpStreamKey: creds.call.rtmpStreamKey,
            });
          })
          .catch((e) => {
            logError("Failed to retrieve call details", e);
            setError(e);
          });
      })
      .catch((err: Error) => {
        logError(err);
        setError(err);
      });
  }, [roomID]);

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
        <LivestreamView
          call={state.call}
          rtmpAddress={state.rtmpAddress}
          rtmpStreamKey={state.rtmpStreamKey}
        />
      </StreamCall>
    </StreamVideo>
  );
};

const handleStopLive = async (call: Call) => {
  return Promise.all([
    call.stopLive(),
    call.sendCustomEvent({
      type: "STOP_LIVE",
      callId: call.id,
    }),
  ]).then(() => {
    // Force call state refresh to ensure the UI is updated.
    call.get();
  });
};

const handleGoLive = async (call: Call) => {
  return call.goLive({ start_hls: false, start_recording: true }).then(() => {
    // Force call state refresh to ensure the UI is updated.
    call.get().catch((err) => console.log("ERROR" + err));
  });
};

const SelectStreamType = ({ setStreamType }: { setStreamType: any }) => {
  return (
    <>
      <span>Start streaming with:</span>
      <br />
      <button
        className="padded:s-2 clickable whiteFill greenFill:hover"
        onClick={() => setStreamType("RTMPS")}
      >
        RTMPS
      </button>
      <button
        className="padded:s-2 clickable whiteFill greenFill:hover"
        onClick={() => setStreamType("Browser")}
      >
        Browser
      </button>
    </>
  );
};

const RtmpsStreamDetails = ({
  rtmpAddress,
  rtmpStreamKey,
}: {
  rtmpAddress: string;
  rtmpStreamKey: string;
}) => {
  return (
    <>
      <span>1a. Set up RTMPS streaming:</span>
      <br />
      <span
        style={{
          maxWidth: "500px",
          textOverflow: "ellipsis",
          wordBreak: "break-all",
        }}
      >
        RTMPS Address: {rtmpAddress}
      </span>
      <span
        style={{
          maxWidth: "500px",
          textOverflow: "ellipsis",
          wordBreak: "break-all",
        }}
      >
        RTMPS Stream Key: {rtmpStreamKey}
      </span>
    </>
  );
};

const BrowserStreamDetails = ({ call }) => {
  const [error, setError] = useState<Error>();

  const { useCameraState, useMicrophoneState, useIsCallLive, useParticipants } =
    useCallStateHooks();

  const { camera: cam, isEnabled: isCamEnabled } = useCameraState();
  const { microphone: mic, isEnabled: isMicEnabled } = useMicrophoneState();
  const [camDevices, setCamDevices] = useState<MediaDeviceInfo[]>([]);
  const [micDevices, setMicDevices] = useState<MediaDeviceInfo[]>([]);

  const joinCall = useCallback(() => {
    return call.join().catch((e: Error) => {
      logError(`Failed to join call: ${e}`);
      setError(e);
    });
  }, [call]);

  const leaveCall = useCallback(() => {
    call.leave().catch((e: Error) => {
      logError(`Failed to leave call: ${e}`);
      setError(e);
    });
  }, [call]);

  useEffect(() => {
    // Promise.all([joinCall(), cam.enable(), mic.enable()]).catch(console.error);
    console.log("JOINING CALL");
    joinCall().then(() => {
      console.log("ENABLING CAM");
      Promise.all([cam.enable(), mic.enable()]).then(() => {
        call.get();
      });
    });
    return leaveCall;
  }, []);

  useEffect(() => {
    call.camera
      .listDevices()
      .subscribe({ next: setCamDevices, error: console.error });
  }, [isCamEnabled]);

  useEffect(() => {
    call.microphone
      .listDevices()
      .subscribe({ next: setMicDevices, error: console.error });
  }, [isMicEnabled]);

  return (
    <>
      {camDevices.length > 0 && (
        <select
          value={call.camera.state.selectedDevice}
          onChange={(event) => call.camera.select(event.target.value)}
          className="padded:s-2"
        >
          {camDevices.map((device, idx) => {
            return (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Device ${idx}`}
              </option>
            );
          })}
        </select>
      )}
      {micDevices.length > 0 && (
        <select
          value={call.microphone.state.selectedDevice}
          onChange={(event) => call.microphone.select(event.target.value)}
          className="padded:s-2"
        >
          {micDevices.map((device, idx) => {
            return (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Device ${idx}`}
              </option>
            );
          })}
        </select>
      )}
    </>
  );
};

const LivestreamView = ({
  call,
  rtmpAddress,
  rtmpStreamKey,
}: {
  call: Call;
  rtmpAddress: string;
  rtmpStreamKey: string;
}) => {
  const { useIsCallLive, useParticipants } = useCallStateHooks();

  const isLive = useIsCallLive();

  const [streamType, setStreamType] = useState<"RTMPS" | "Browser" | null>(
    null,
  );

  const participants = useParticipants();

  const VIDEO = 2;
  const liveParticipants = participants.filter((p) =>
    p.publishedTracks.includes(VIDEO),
  );

  console.log({
    isLive,
    participants,
    liveParticipants,
  });

  useEffect(() => {
    return () => {
      handleStopLive(call);
    };
  }, []);

  let panelRef = createRef<HTMLDivElement>();

  let streamInfo;

  if (streamType == null) {
    streamInfo = <SelectStreamType setStreamType={setStreamType} />;
  } else if (streamType === "RTMPS") {
    streamInfo = (
      <RtmpsStreamDetails
        rtmpAddress={rtmpAddress}
        rtmpStreamKey={rtmpStreamKey}
      />
    );
  } else {
    streamInfo = <BrowserStreamDetails call={call} />;
  }

  return (
    <>
      <Draggable handle=".handle" nodeRef={panelRef}>
        <div
          className="stack:s-2 grayFill relative border uiLayer "
          style={{ position: "fixed", top: "var(--s3)", right: "var(--s1)" }}
          ref={panelRef}
        >
          <div
            className="handle horizontal-stack padded:s-2 caption"
            style={{
              minHeight: "var(--sp0)",
              height: "var(--sp0)",
              background: "black",
              color: "white",
            }}
          >
            <div>...</div>
            <div>Admin Panel</div>
          </div>
          <div className="padded:s-2 stack:s-0 monospace">
            <div className="fullBleed">
              <div className="stack:s-2">
                {streamType != null && (
                  <>
                    <button
                      className="padded:s-2 clickable whiteFill greenFill:hover"
                      onClick={() => setStreamType(null)}
                    >
                      Back
                    </button>
                    <br />
                    <hr />
                    <br />
                  </>
                )}
                {streamInfo}
                {streamType != null && (
                  <>
                    <br />
                    <hr />
                    <br />
                    <span>2. Begin streaming to the public:</span>
                    <br />
                    <button
                      className={classNames(
                        "padded:s-2 clickable",
                        isLive ? "greenFill" : "whiteFill greenFill:hover",
                      )}
                      onClick={() =>
                        isLive ? handleStopLive(call) : handleGoLive(call)
                      }
                    >
                      {isLive ? "Stop Livestream" : "Start livestream"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Draggable>
      <div className="fullBleed center:children">
        {liveParticipants.length > 0 ? (
          <ParticipantView
            participant={liveParticipants[0]}
            ParticipantViewUI={null}
          />
        ) : (
          <div>Waiting for video...</div>
        )}
      </div>
    </>
  );
};

export default StreamLive;
