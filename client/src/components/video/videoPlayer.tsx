import { roomIsActive, roomIsArchive, roomIsTest, useRoomStore } from "../../stores/currentRoomStore";

import ReactPlayer from "react-player";
import StreamPlayer from "./streamPlayer";
import { useGlobalAdminStore } from "../../stores/globalUserAdminStore";
import { useCallback, useEffect, useState } from "react";


interface VideoPlayerProps {
  muteOverride?: boolean;
  hideMuteButton?: boolean;
}
const VideoPlayer: React.FunctionComponent<VideoPlayerProps> = ({
  hideMuteButton,
  muteOverride,
}) => {
  const streamPlaybackID = useRoomStore(
    useCallback((s) => s.roomInfo?.streamPlaybackID, []),
  );

  const streamStatus = useRoomStore(
    useCallback((s) => s.roomInfo?.streamStatus, []),
  );
  const hideVideo = useGlobalAdminStore(useCallback((s) => s.hideVideo, []));



  return (
    <>
      {roomIsArchive(streamStatus) && <ArchiveVideoPlayer hideMuteButton={hideMuteButton} muteOverride={muteOverride} />}
      {!hideVideo && roomIsActive(streamStatus) && (
        <VideoPlayerInternal
          streamPlaybackID={streamPlaybackID}
          hideMuteButton={hideMuteButton}
          muteOverride={muteOverride}
          isTest={roomIsTest(streamStatus)}
        />
      )}
    </>
  );
};

const ArchiveVideoPlayer: React.FunctionComponent<{ hideMuteButton?: boolean, muteOverride?: boolean }> = ({ hideMuteButton, muteOverride }) => {
  const archiveURL = useRoomStore(
    useCallback((s) => s.roomInfo?.archiveURL, []),
  );

  const [mute, setMuted] = useState(false);

  useEffect(() => {
    console.log("!!!! archive url", archiveURL);
  }, [archiveURL]);

  return (
    <div className="fullBleed">
      <div className="videoLayer videoAspectContainer">
        <ReactPlayer
          url={archiveURL}
          playing={true}
          muted={muteOverride || false}
          className="noEvents testPlayer "
          height={"inherit"}
          width={"inherit"}
          loop={true}
        />
      </div>
    </div>
  )
};

const VideoPlayerInternal: React.FunctionComponent<{
  streamPlaybackID?: string;
  hideMuteButton?: boolean;
  muteOverride?: boolean;
  isTest?: boolean;
}> = ({ streamPlaybackID, hideMuteButton, isTest, muteOverride }) => {

  const [mute, setMuted] = useState(false);


  return (
    <div className="fullBleed" key="videoPlayer" id="videoPlayer">
      {!hideMuteButton && (
        <div
          className="highestLayer padded:s-2"
          style={{ position: "fixed", left: "0px", top: "0px" }}
        >
          <div
            className="border-thin whiteFill padded:s-3 clickable greenFill:hover"
            onClick={() => setMuted(!mute)}
          >
            {mute ? "unmute video" : "mute video"}
          </div>
        </div>
      )}
      <div className="videoLayer videoAspectContainer">
        {!isTest && streamPlaybackID && (
          <StreamPlayer
            muted={mute || muteOverride || false}
            fullscreen={true}
          />
        )}
        {!isTest && !streamPlaybackID && (
          <div>something went wrong with the stream...</div>
        )}
        {isTest && (
          <div className="videoAspectElement">
            <ReactPlayer
              url={
                "https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8"
              }
              playing={true}
              muted={mute || muteOverride}
              className="noEvents testPlayer "
              height={"inherit"}
              width={"inherit"}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
