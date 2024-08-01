import { useCallback, useMemo, useState } from "react";
import useRingStore, { roomIDToHREF } from "../../stores/ringStore";
import VideoPreview from "../videoPreview";
import { roomIsActive, visibleRooms } from "../../stores/roomStore";
import { useRouter } from "next/router";

const DomRing = () => {
  const ring = useRingStore(useCallback((s) => s.links, []));

  const domElements = useMemo(() => {
    const rooms = visibleRooms(ring);

    const spacePerElement = 100 / Object.keys(rooms).length;
    const elements = Object.entries(rooms).map(([roomID, roomInfo], index) => {
      return (
        <NodeElement
          roomInfo={roomInfo}
          key={roomID}
          offsetN={index * spacePerElement}
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

const NodeElement: React.FC<{ roomInfo: RoomLinkInfo; offsetN: number }> = ({
  roomInfo,
  offsetN,
}) => {
  if (roomIsActive(roomInfo)) {
    return <OnlineElement roomInfo={roomInfo} offsetN={offsetN} />;
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
        {roomInfo.previewOverlay && <div className="absoluteOrigin fullBleed highestLayer">
          <img src={roomInfo.previewOverlay} className="fullBleed absoluteOrigin noEvents noSelect"/>
        </div>}
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
          backgroundColor: roomInfo.roomColor,
        } as React.CSSProperties
      }
    >
      {roomInfo.roomName} is offline
    </div>
  );
};
export default DomRing;
