import { useCallback, useMemo } from "react";
import useRingStore, { roomIDToHREF } from "../../stores/ringStore";
import VideoPreview from "../videoPreview";
import { roomIsActive } from "../../stores/roomStore";
import { useRouter } from "next/router";

const DomRing = () => {
  const ring = useRingStore(useCallback((s) => s.links, []));

  const domElements = useMemo(() => {
    const numKeys = Object.keys(ring).length;
    const spacePerElement = 100 / numKeys;
    const elements = Object.keys(ring).map((key, index) => {
      return (
        <NodeElement
          roomInfo={ring[key]}
          key={key}
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
    >
      <div className="homepageVideo noOverflow border">
        <VideoPreview
          localMuted={true}
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
