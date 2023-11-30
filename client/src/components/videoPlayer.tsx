import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { roomIsActive, roomIsTest, useRoomStore } from "../stores/roomStore";
import MuxPlayer from "@mux/mux-player-react/lazy";
import { logError, logVideo } from "../lib/logger";
import { generateStreamLink } from "../lib/server-api";
import { useAdminStore } from "../stores/adminStore";
import ReactPlayer from "react-player";
import useLocalMutedStore from "../stores/localMuteStore";


interface VideoPlayerProps {
  streamPlaybackID?: string;
  muteOverride?: boolean;
  hideMuteButton?: boolean;
}
const VideoPlayer: React.FunctionComponent<VideoPlayerProps> = ({ hideMuteButton , muteOverride}) => {
  const streamPlaybackID = useRoomStore(useCallback((s) => s.roomInfo?.streamPlaybackID, []));
  const streamStatus = useRoomStore(useCallback((s) => s.roomInfo?.streamStatus, []));
  const hideVideo = useAdminStore(useCallback((s) => s.hideVideo, []));
  return (
    <>
      {!hideVideo && streamPlaybackID && roomIsActive(streamStatus) && (
        <VideoPlayerInternal
          streamPlaybackID={streamPlaybackID}
          hideMuteButton={hideMuteButton}
          muteOverride={muteOverride}
          isTest={roomIsTest(streamStatus)}
        />
      )}
      {!hideVideo && streamStatus == "active" && streamPlaybackID == undefined && (
        <div>something went wrong with the stream...</div>
      )}
    </>
  );
};

const VideoPlayerInternal: React.FunctionComponent<{
  streamPlaybackID: string;
  hideMuteButton?: boolean;
  muteOverride?: boolean;
  isTest?: boolean;
}> = ({ streamPlaybackID, hideMuteButton, isTest, muteOverride }) => {
  const mute = useLocalMutedStore(useCallback((s) => s.localMuted, []));;
  const setMuted = useLocalMutedStore(useCallback((s) => s.setLocalMuted, []));;

  useEffect(() => {
    streamPlaybackID && logVideo(` stream: `, generateStreamLink(streamPlaybackID));
  }, [streamPlaybackID]);

  return (
    <div className="fullBleed" key="videoPlayer" id="videoPlayer">
      {!hideMuteButton && (
        <div className="highestLayer padded" style={{ position: "fixed", top: "0px", right: "0px" }}>
          <div
            className="border-thin whiteFill padded:s-2 clickable contrastFill:hover showOnHoverSelfTrigger"
            onClick={() => setMuted(!mute)}
          >
            {mute ? "unmute" : "mute"}
          </div>
        </div>
      )}
      {
        <div className="videoLayer videoAspectContainer">
          {!isTest && (
            <MuxPlayer
              playbackId={streamPlaybackID}
              autoPlay={"any"}
              muted={mute || muteOverride}
              className="noEvents videoAspectElement"
              nohotkeys={true}
              onError={(e) => logError(e)}
            />
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
      }
    </div>
  );
};

export default VideoPlayer;
