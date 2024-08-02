import {
  Call,
  ParticipantView,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { createRef, useCallback, useEffect, useMemo, useState } from "react";

import StreamPlayer from "../streamPlayer";
import classNames from "classnames";
import { getStreamAdminCredentials } from "../../lib/server-api";
import { logError } from "../../lib/logger";

interface StreamConfig {
  apiKey: string;
  userId: string;
}

/**
 * This component is only shown after we have already verified the user as a room admin, so we can make calls using secrets
 * retrieved from the server and not worry too much about those credentials being viewable in the console.
 */
const AdminStreamPanel: React.FC<{
  rtmpsDetails: RtmpsDetails | null;
}> = ({ rtmpsDetails }) => {
  const [error, setError] = useState<Error>();

  if (error) {
    return <div className="fullBleed center:children">{error.message}</div>;
  }

  return <LivestreamView rtmpsDetails={rtmpsDetails} />;
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
      <button
        className="padded:s-2 clickable whiteFill greenFill:hover"
        onClick={() => setStreamType("RTMPS")}
      >
        Show RTMPS Info
      </button>
      <button
        className="padded:s-2 clickable whiteFill greenFill:hover"
        onClick={() => setStreamType("Browser")}
      >
        Enable browser video
      </button>
    </>
  );
};

const RtmpsStreamDetails = ({
  call,
  rtmpAddress,
  rtmpStreamKey,
}: {
  call: Call;
  rtmpAddress: string;
  rtmpStreamKey: string;
}) => {
  useEffect(() => {
    return () => {
      handleStopLive(call);
    };
  }, []);

  return (
    <>
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

const BrowserStreamDetails = ({ call }: { call: Call }) => {
  const { useCameraState, useMicrophoneState } = useCallStateHooks();

  const { camera: cam, isEnabled: isCamEnabled } = useCameraState();
  const { microphone: mic, isEnabled: isMicEnabled } = useMicrophoneState();
  const [camDevices, setCamDevices] = useState<MediaDeviceInfo[]>([]);
  const [micDevices, setMicDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    return () => {
      handleStopLive(call);
    };
  }, []);

  useEffect(() => {
    Promise.all([cam.enable(), mic.enable()]).then(() => {
      call.get();
    });

    return () => {
      Promise.all([cam.disable(), mic.disable()]);
    };
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
  rtmpsDetails,
}: {
  rtmpsDetails: RtmpsDetails | null;
}) => {
  const call = useCall();
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

  const liveReady = liveParticipants.length > 0;

  console.log({
    streamType,
    isLive,
    participants,
    liveParticipants,
    adminPanel: true,
    call,
  });

  if (!call) {
    return <div>Missing call data. Loading...</div>;
  }

  let streamInfo;

  if (streamType == null) {
    streamInfo = <SelectStreamType setStreamType={setStreamType} />;
  } else if (streamType === "RTMPS" && rtmpsDetails) {
    streamInfo = (
      <RtmpsStreamDetails
        call={call}
        rtmpAddress={rtmpsDetails.rtmpAddress}
        rtmpStreamKey={rtmpsDetails.rtmpStreamKey}
      />
    );
  } else if (streamType === "Browser") {
    streamInfo = <BrowserStreamDetails call={call} />;
  } else {
    console.log({ rtmpsDetails });
    streamInfo = <div>Ooopsssopsospsopsopospo</div>;
  }

  return (
    <>
      {streamType != null && (
        <>
          <button
            className="padded:s-2 clickable whiteFill greenFill:hover"
            onClick={() => setStreamType(null)}
          >
            Back
          </button>
        </>
      )}
      {streamInfo}
      {isLive || liveReady ? (
        <>
          <br />
          <hr />
          <br />
          {!isLive && (
            <>
              <span>
                {liveParticipants.length} video input
                {liveParticipants.length > 1 ? "s" : ""} ready.
              </span>
              <br />
              <div
                className="videoAspectContainer"
                style={{ width: "302px", height: "169px" }}
              >
                <ParticipantView
                  participant={liveParticipants[0]}
                  muteAudio={true}
                  className="noEvents stream-player videoAspect"
                />
              </div>
              <br />
            </>
          )}
          <button
            className={classNames(
              "padded:s-2 clickable",
              isLive ? "greenFill" : "whiteFill greenFill:hover",
            )}
            onClick={() => (isLive ? handleStopLive(call) : handleGoLive(call))}
          >
            {isLive ? "Stop Livestream" : "Start livestream"}
          </button>
        </>
      ) : (
        <br />
      )}
    </>
  );
};

export default AdminStreamPanel;
