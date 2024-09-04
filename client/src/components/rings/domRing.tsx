import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";

import useRingStore, { roomIDToHREF } from "../../stores/ringStore";
import { roomIsActive } from "../../stores/roomStore";
import VideoPreview from "../videoPreview";
import { useMediaQuery } from "react-responsive";

const DomRing = () => {
  const ring = useRingStore(useCallback((s) => s.links, []));
  const isMobile = useMediaQuery({ maxWidth: 768 });
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
  }, [ring]);

  return (
    <div id="rotatingEllipseContainer" className="stickerLayer">
      {domElements}
    </div>
  );
};

const NodeElement: React.FC<{ roomInfo: RoomLinkInfo; offsetN: number; isMobile: boolean }> = ({
  roomInfo,
  offsetN,
  isMobile,
}) => {
  if (roomIsActive(roomInfo)) {
    if (isMobile) {
      return <OnlineElementSimple roomInfo={roomInfo} offsetN={offsetN} />;
    } else {
      return <OnlineElement roomInfo={roomInfo} offsetN={offsetN} />;
    }
  } else {
    return <OfflineElement roomInfo={roomInfo} offsetN={offsetN} />;
  }
};
const OnlineElement: React.FC<{ roomInfo: RoomLinkInfo; offsetN: number }> = ({
  roomInfo,
  offsetN,
}) => {
  const router = useRouter();
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
      onClick={() => router.push(roomIDToHREF(roomInfo.roomID))}
      onMouseOver={() => setIsHovering(true)}
      onMouseOut={() => setIsHovering(false)}
    >
      <div className="homepageVideo noOverflow border">
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


const OnlineElementSimple: React.FC<{ roomInfo: RoomLinkInfo; offsetN: number }> = ({
  roomInfo,
  offsetN,
}) => {
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
    >
      {roomInfo.roomName} is online
    </div>
  );
};

const OfflineElement: React.FC<{ roomInfo: RoomLinkInfo; offsetN: number }> = ({
  roomInfo,
  offsetN,
}) => {
  return (
    <div
      className="antiRotate homepageLabel smallElementOnEllipse padded:s-2 border whiteFill"
      style={
        {
          "--animStart": offsetN + "%",
          "--animEnd": 100 + offsetN + "%",
          backgroundColor: "white",
        } as React.CSSProperties
      }
    >
      {roomInfo.roomName} is offline
    </div>
  );
};
export default DomRing;
