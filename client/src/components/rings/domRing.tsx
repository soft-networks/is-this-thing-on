import { StreamVideoClient, User } from "@stream-io/video-react-sdk";
import { roomIsActive, roomIsArchive } from "../../stores/currentRoomStore";
import { useCallback, useEffect, useMemo, useState } from "react";
import useGlobalRoomsInfoStore, {
  roomIDToHREF,
} from "../../stores/globalRoomsInfoStore";

import VideoPreview from "../video/videoPreview";
import useMediaQuery from "../../stores/useMediaQuery";
import { useRouter } from "next/router";

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
    return element;
  } else if (roomIsArchive(roomInfo)) {
    return (
      <ArchiveElement roomInfo={roomInfo} offsetN={offsetN} onClick={onClick} />
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
      className="homepageVideo antiRotate smallElementOnEllipse relative clickable homepageLabelHoverTrigger"
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
        style={
          {
            backgroundColor: roomInfo.roomColor,
            "--bg": roomInfo.roomColor,
          } as React.CSSProperties
        }
      >
        {roomInfo.roomName} is online
      </div>
    </div>
  );
};

const ArchiveElement: React.FC<{
  roomInfo: RoomSummary;
  offsetN: number;
  onClick: () => void;
}> = ({ roomInfo, offsetN, onClick }) => {
  return (
    <div
      className="antiRotate homepageLabel homepageLabelInverse smallElementOnEllipse padded:s-2 border whiteFill cursor:pointer"
      style={
        {
          "--animStart": offsetN + "%",
          "--animEnd": 100 + offsetN + "%",
          "--bg": roomInfo.roomColor,
        } as React.CSSProperties
      }
      onClick={onClick}
    >
      {roomInfo.roomName} is looping
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
      className="antiRotate homepageLabel smallElementOnEllipse padded:s-2 border whiteFill cursor:pointer"
      style={
        {
          "--animStart": offsetN + "%",
          "--animEnd": 100 + offsetN + "%",
          backgroundColor: roomInfo.roomColor,
          "--bg": roomInfo.roomColor,
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
      className="antiRotate homepageLabel smallElementOnEllipse padded:s-2 border whiteFill cursor:pointer"
      style={
        {
          "--animStart": offsetN + "%",
          "--animEnd": 100 + offsetN + "%",
          backgroundColor: roomInfo.roomColor,
          "--bg": roomInfo.roomColor,
        } as React.CSSProperties
      }
      onClick={onClick}
    >
      {roomInfo.roomName} is offline
    </div>
  );
};
export default DomRing;
