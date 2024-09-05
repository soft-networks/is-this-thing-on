import ReactPlayer from "react-player";

import { useCallback } from "react";

import { useAdminStore } from "../stores/adminStore";
import useLocalMutedStore from "../stores/localMuteStore";
import { roomIsActive, roomIsTest, useRoomStore } from "../stores/roomStore";
import StreamPlayer from "./streamPlayer";

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
  const hideVideo = useAdminStore(useCallback((s) => s.hideVideo, []));
  return (
    <>
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

const VideoPlayerInternal: React.FunctionComponent<{
  streamPlaybackID?: string;
  hideMuteButton?: boolean;
  muteOverride?: boolean;
  isTest?: boolean;
}> = ({ streamPlaybackID, hideMuteButton, isTest, muteOverride }) => {
  const mute = useLocalMutedStore(useCallback((s) => s.localMuted, []));
  const setMuted = useLocalMutedStore(useCallback((s) => s.setLocalMuted, []));

  return (
    <div className="fullBleed" key="videoPlayer" id="videoPlayer">
      {!hideMuteButton && (
        <div
          className="highestLayer padded"
          style={{ position: "fixed", left: "0px", top: "0px" }}
        >
          <div
            className="border-thin whiteFill padded:s-3 clickable contrastFill:hover"
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
            streamCallId={streamPlaybackID}
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
