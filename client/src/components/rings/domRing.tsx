import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";

import useGlobalRoomsInfoStore, { roomIDToHREF } from "../../stores/globalRoomsInfoStore";
import { roomIsActive } from "../../stores/currentRoomStore";
import useMediaQuery from "../../stores/useMediaQuery";
import StreamGate from "../gates/streamGate";
import VideoPreview from "../video/videoPreview";

const DomRing = () => {
  const ring = useGlobalRoomsInfoStore(useCallback((s) => s.rooms, []));
  const isMobile = useMediaQuery();
  const domElements = useMemo(() => {
    const numKeys = Object.keys(ring).length;
    const spacePerElement = 100 / numKeys;
    const elements = Object.keys(ring).map((key, index) => {
      return (
        <NodeElement
          roomInfo={ring[key]}
          key={key}
          offsetN={index * spacePerElement}
          isMobile={isMobile}
        />
      );
    });
    return elements;
  }, [ring, isMobile]);

  return (
    <div id="rotatingEllipseContainer" className="stickerLayer">
      {domElements}
    </div>
  );
};

const NodeElement: React.FC<{
  roomInfo: RoomSummary;
  offsetN: number;
  isMobile: boolean;
}> = ({ roomInfo, offsetN, isMobile }) => {
  const router = useRouter();
  const onClick = useCallback(() => {
    console.log("navigating to room", roomInfo.roomID);
    router.push(roomIDToHREF(roomInfo.roomID));
  }, [roomInfo.roomID, router]);

  if (roomIsActive(roomInfo)) {
    let element;
    if (isMobile) {
      element = (
        <OnlineElementSimple
          roomInfo={roomInfo}
          offsetN={offsetN}
          onClick={onClick}
        />
      );
    } else {
      element = (
        <OnlineElement
          roomInfo={roomInfo}
          offsetN={offsetN}
          onClick={onClick}
        />
      );
    }

    return (
      <StreamGate
        roomID={roomInfo.roomID}
        streamPlaybackID={roomInfo.streamPlaybackID}
        anonymousOnly={false}
      >
        {() => element}
      </StreamGate>
    );
  } else {
    return (
      <OfflineElement roomInfo={roomInfo} offsetN={offsetN} onClick={onClick} />
    );
  }
};
const OnlineElement: React.FC<{
  roomInfo: RoomSummary;
  offsetN: number;
  onClick: () => void;
}> = ({ roomInfo, offsetN, onClick }) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);

  return (
    <div
      className="homepageVideo antiRotate largeElementOnEllipse relative clickable"
      style={
        {
          "--animStart": offsetN + "%",
          "--animEnd": 100 + offsetN + "%",
        } as React.CSSProperties
      }
      onMouseOver={() => setIsHovering(true)}
      onMouseOut={() => setIsHovering(false)}
      onClick={onClick}
    >
      <div className="homepageVideo noOverflow border hideOnMobile">
        {roomInfo.previewOverlay && (
          <div className="absoluteOrigin fullBleed highestLayer">
            <img
              src={roomInfo.previewOverlay}
              className="fullBleed absoluteOrigin noEvents noSelect"
            />
          </div>
        )}
        <VideoPreview
          localMuted={!isHovering}
          iLink={roomInfo}
          isTest={roomInfo.streamStatus.includes("test")}
        />
      </div>
      <div
        className="center:absolute highestLayer border padded:s-2 homepageLabel"
        style={{
          backgroundColor: roomInfo.roomColor,
        }}
      >
        {roomInfo.roomName} is online
      </div>
    </div>
  );
};

const OnlineElementSimple: React.FC<{
  roomInfo: RoomSummary;
  offsetN: number;
  onClick: () => void;
}> = ({ roomInfo, offsetN, onClick }) => {
  return (
    <div
      className="antiRotate homepageLabel smallElementOnEllipse padded:s-2 border whiteFill"
      style={
        {
          "--animStart": offsetN + "%",
          "--animEnd": 100 + offsetN + "%",
          backgroundColor: roomInfo.roomColor,
        } as React.CSSProperties
      }
      onClick={onClick}
    >
      {roomInfo.roomName} is online
    </div>
  );
};

const OfflineElement: React.FC<{
  roomInfo: RoomSummary;
  offsetN: number;
  onClick: () => void;
}> = ({ roomInfo, offsetN, onClick }) => {
  return (
    <div
      className="antiRotate homepageLabel smallElementOnEllipse padded:s-2 border whiteFill"
      style={
        {
          "--animStart": offsetN + "%",
          "--animEnd": 100 + offsetN + "%",
          backgroundColor: roomInfo.roomColor,
        } as React.CSSProperties
      }
      onClick={onClick}
    >
      {roomInfo.roomName} is offline
    </div>
  );
};
export default DomRing;
