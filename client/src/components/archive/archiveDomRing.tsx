import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import useArchiveStore, { archiveRoomToSummary } from "../../stores/archiveStore";
import useMediaQuery from "../../stores/useMediaQuery";
import { ReactPlayerWrapper } from "../video/videoPreview";
import classNames from "classnames";

const ArchiveDomRing = () => {
  const rooms = useArchiveStore(useCallback((s) => s.rooms, []));
  const archiveInfo = useArchiveStore(useCallback((s) => s.archiveInfo, []));
  const isMobile = useMediaQuery();

  const domElements = useMemo(() => {
    const keys = Object.keys(rooms);
    const numKeys = keys.length;
    const spacePerElement = 100 / numKeys;
    return keys.map((key, index) => (
      <ArchiveNodeElement
        room={rooms[key]}
        archiveID={archiveInfo?.archiveID || ""}
        key={key}
        offsetN={index * spacePerElement}
        isMobile={isMobile}
      />
    ));
  }, [rooms, isMobile, archiveInfo]);

  return (
    <div id="rotatingEllipseContainer" className="stickerLayer">
      {domElements}
    </div>
  );
};

const ArchiveNodeElement: React.FC<{
  room: ArchiveRoomInfo;
  archiveID: string;
  offsetN: number;
  isMobile: boolean;
}> = ({ room, archiveID, offsetN, isMobile }) => {
  const router = useRouter();
  const onClick = useCallback(() => {
    router.push(`/archive/${archiveID}/${room.roomID}`);
  }, [room.roomID, archiveID, router]);

  if (isMobile) {
    return <ArchiveElementSimple room={room} offsetN={offsetN} onClick={onClick} />;
  }
  return <ArchiveElementDesktop room={room} offsetN={offsetN} onClick={onClick} />;
};

const ArchiveElementDesktop: React.FC<{
  room: ArchiveRoomInfo;
  offsetN: number;
  onClick: () => void;
}> = ({ room, offsetN, onClick }) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className={classNames(
        "homepageVideo antiRotate largeElementOnEllipse relative clickable homepageLabelHoverTrigger",
        { mars: isHovering }
      )}
      style={{
        "--animStart": offsetN + "%",
        "--animEnd": 100 + offsetN + "%",
      } as React.CSSProperties}
      onMouseOver={() => setIsHovering(true)}
      onMouseOut={() => setIsHovering(false)}
      onClick={onClick}
    >
      <div className="homepageVideo noOverflow border hideOnMobile">
        <ReactPlayerWrapper
          url={room.archiveURL}
          muted={!isHovering}
          seek={true}
        />
      </div>
      <div
        className="center:absolute highestLayer border padded:s-2 homepageLabel homepageLabelInverse"
        style={{
          backgroundColor: room.roomColor,
          "--bg": room.roomColor,
        } as React.CSSProperties}
      >
        {room.roomName} is looping
      </div>
    </div>
  );
};

const ArchiveElementSimple: React.FC<{
  room: ArchiveRoomInfo;
  offsetN: number;
  onClick: () => void;
}> = ({ room, offsetN, onClick }) => {
  return (
    <div
      className="antiRotate homepageLabel largeElementOnEllipse padded:s-2 border whiteFill cursor:pointer relative stickerLayer homepageLabelInverse"
      style={{
        "--animStart": offsetN + "%",
        "--animEnd": 100 + offsetN + "%",
        backgroundColor: room.roomColor,
        "--bg": room.roomColor,
      } as React.CSSProperties}
      onClick={onClick}
    >
      {room.roomName} is looping
    </div>
  );
};

export default ArchiveDomRing;
