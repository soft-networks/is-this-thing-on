import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";

import { roomIsActive, roomIsArchive } from "../../stores/currentRoomStore";
import useGlobalRoomsInfoStore, {
  roomIDToHREF,
} from "../../stores/globalRoomsInfoStore";
import useMediaQuery from "../../stores/useMediaQuery";
import VideoPreview from "../video/videoPreview";
import ReactPlayer from "react-player";
import { CoffeePreview } from "../artistRooms/coffee";
import classNames from "classnames";

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

  if (isMobile) {
    return <NodeElementMobile roomInfo={roomInfo} offsetN={offsetN} onClick={onClick} />;
  } else {
    return <NodeElementDesktop roomInfo={roomInfo} offsetN={offsetN} onClick={onClick} />;
  }
};

const NodeElementDesktop: React.FC<{
  roomInfo: RoomSummary;
  offsetN: number;
  onClick: () => void;
}> = ({ roomInfo, offsetN, onClick }) => {
  if (roomIsActive(roomInfo)) {
    return <OnlineElement roomInfo={roomInfo} offsetN={offsetN} onClick={onClick} />;
  } else if (roomIsArchive(roomInfo)) {
    return <ArchiveElement roomInfo={roomInfo} offsetN={offsetN} onClick={onClick} />;
  } else {
    return <OfflineElement roomInfo={roomInfo} offsetN={offsetN} onClick={onClick} />;
  }
};

const NodeElementMobile: React.FC<{
  roomInfo: RoomSummary;
  offsetN: number;
  onClick: () => void;
}> = ({ roomInfo, offsetN, onClick }) => {

  if (roomIsActive(roomInfo)) {
    return <OnlineElementSimple roomInfo={roomInfo} offsetN={offsetN} onClick={onClick} />;
  } else if (roomIsArchive(roomInfo)) {
    return <ArchiveElementSimple roomInfo={roomInfo} offsetN={offsetN} onClick={onClick} />;
  } else {
    return <div className="smallElementOnEllipse border videoLayer" style={{
      backgroundColor: roomInfo.roomColor, width: "12px", height: "12px", borderRadius: "50%", "--animStart": offsetN + "%",
      "--animEnd": 100 + offsetN + "%",
    } as React.CSSProperties}></div>
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
      className={classNames("homepageVideo antiRotate largeElementOnEllipse relative clickable homepageLabelHoverTrigger", {mars: isHovering})}
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
  const [isHovering, setIsHovering] = useState<boolean>(false);

  return (
    <div
      className={classNames("homepageVideo antiRotate largeElementOnEllipse relative clickable homepageLabelHoverTrigger", {mars: isHovering})}
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
        <ReactPlayer
          url={roomInfo.archiveURL}
          playing={true}
          muted={true}
          className="noEvents"
          width={"302px"}
          height={"169px"}
          style={{ margin: "-1px" }}
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
        {roomInfo.roomName} is looping
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
      className="antiRotate homepageLabel largeElementOnEllipse padded:s-2 border whiteFill cursor:pointer relative stickerLayer"
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
      {roomInfo.roomName} is on
    </div>
  );
};

const ArchiveElementSimple: React.FC<{
  roomInfo: RoomSummary;
  offsetN: number;
  onClick: () => void;
}> = ({ roomInfo, offsetN, onClick }) => {
  return (
    <div
      className="antiRotate homepageLabel largeElementOnEllipse padded:s-2 border whiteFill cursor:pointer relative stickerLayer homepageLabelInverse"
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
      {roomInfo.roomName} is looping
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
      {roomInfo.roomName} is off
    </div>
  );
};
export default DomRing;
