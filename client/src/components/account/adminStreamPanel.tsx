import {
  Call,
  ParticipantView,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import classNames from "classnames";

import { useEffect, useState } from "react";

/**
 * This panel fits into the overall AdminPanel and manages the Stream video and audio.
 */
const AdminStreamPanel: React.FC<{
  rtmpsDetails: RtmpsDetails | null;
}> = ({ rtmpsDetails }) => {
  const call = useCall();
  const { useIsCallLive, useParticipants } = useCallStateHooks();
  const isLive = useIsCallLive();
  const participants = useParticipants();

  const [streamType, setStreamType] = useState<"RTMPS" | "Browser" | null>(
    null,
  );

  const VIDEO = 2;
  const liveParticipants = participants.filter((p) =>
    p.publishedTracks.includes(VIDEO),
  );

  const liveReady = liveParticipants.length > 0;

  if (!call) {
    return <div>Missing call data. Loading...</div>;
  }

  let streamInfo;

  if (streamType == null) {
    streamInfo = <SelectStreamType setStreamType={setStreamType} />;
  } else if (streamType === "RTMPS") {
    if (rtmpsDetails) {
      streamInfo = (
        <RtmpsStreamDetails
          rtmpAddress={rtmpsDetails.rtmpAddress}
          rtmpStreamKey={rtmpsDetails.rtmpStreamKey}
        />
      );
    } else {
      streamInfo = <div>Missing rtmpsDetails</div>;
    }
  } else if (streamType === "Browser") {
    streamInfo = <BrowserStreamDetails call={call} />;
  }

  return (
    <div className="stack:s-1">
      <div>Stream controls</div>
      {streamType != null && (
        <>
          {/* Show back button if RTMPS or Browser was selected. */}
          <div
            className="padded:s-2 clickable lightFill greenFill:hover border"
            onClick={() => setStreamType(null)}
          >
            back
          </div>
        </>
      )}
      {streamInfo}
      {isLive || liveReady ? (
        <>
          {!isLive && (
            <>
              {/* Show number of available inputs and preview of selected input */}
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
                  participant={liveParticipants[liveParticipants.length - 1]}
                  muteAudio={true}
                  className="noEvents stream-player videoAspect"
                />
              </div>
              <br />
            </>
          )}
          {/* Show button to start or stop livestream */}
          <div
            className={classNames(
              "padded:s-2 clickable border",
              isLive ? "greenFill" : "whiteFill greenFill:hover",
            )}
            onClick={() => (isLive ? handleStopLive(call) : handleGoLive(call))}
          >
            {isLive ? "🚫 Stop Livestream" : "🔴 Start livestream"}
          </div>
        </>
      ) : (
        <br />
      )}
    </div>
  );
};

// To stop livestream, tell Stream to stop the call and then send a custom event. The event will
// send a webhook to our API and update Firestore to set the room state to inactive.
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

// Start livestreams with HLS disabled and recording enabled.
const handleGoLive = async (call: Call) => {
  return call.goLive({ start_hls: false, start_recording: true }).then(() => {
    // Force call state refresh to ensure the UI is updated.
    call.get().catch((err) => console.log("ERROR " + err));
  });
};

// On initial page load, show these options to either provide RTMPS info
// or to enable the camera and mic for browser-based streaming.
const SelectStreamType = ({ setStreamType }: { setStreamType: any }) => {
  return (
    <div className="stack">
      <div
        className="padded:s-2 clickable whiteFill greenFill:hover border"
        onClick={() => setStreamType("Browser")}
      >
        🎥 Enable camera to stream
      </div>
      <div
        className="padded:s-2 clickable lightFill greenFill:hover border:gray"
        onClick={() => setStreamType("RTMPS")}
      >
        or show RTMPS Info
      </div>
    </div>
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

// When selecting "Enable browser video", enable the camera/microphone and
// allow the admin to select different inputs.
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

export default AdminStreamPanel;
