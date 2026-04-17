import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import useArchiveStore, { archiveRoomToSummary } from "../../stores/archiveStore";
import useMediaQuery from "../../stores/useMediaQuery";
import classNames from "classnames";

const ArchiveFooter: React.FC = () => {
  const isMobile = useMediaQuery();
  const currentRoomID = useArchiveStore(useCallback((s) => s.currentRoomID, []));
  const rooms = useArchiveStore(useCallback((s) => s.rooms, []));
  const archiveInfo = useArchiveStore(useCallback((s) => s.archiveInfo, []));
  const { push } = useRouter();
  const isHome = !currentRoomID;
  const archiveID = archiveInfo?.archiveID || "";

  const handleNextClick = () => {
    const keys = Object.keys(rooms);
    const currentIndex = currentRoomID ? keys.indexOf(currentRoomID) : -1;
    if (isHome) { push(`/archive/${archiveID}/${keys[0]}`); return; }
    if (currentIndex === keys.length - 1) { push(`/archive/${archiveID}`); }
    else { push(`/archive/${archiveID}/${keys[currentIndex + 1]}`); }
  };

  return (
    <>
      <footer
        className={classNames("fullWidth uiLayer horizontal-stack", {
          "align-end:fixed": !isMobile,
          relative: isMobile,
        })}
      >
        <div
          className={classNames("uiLayer padded:s-2 overflowVisible", {
            "centerh:absolute": !isMobile,
          })}
        >
          <ArchiveFooterRing isHome={isHome} />
        </div>
        <div className="uiLayer horizontal-stack:s-2 padded:s-2 align-end">
          {!isMobile && !isHome && <ArchiveScanButton onNext={handleNextClick} />}
          <a href="/learnmore">
            <div className="padded:s-3 border clickable whiteFill greenFill:hover">about</div>
          </a>
          <ArchiveHomeButton />
        </div>
      </footer>
    </>
  );
};

const ArchiveFooterRing: React.FC<{ isHome: boolean }> = ({ isHome }) => {
  const currentRoomID = useArchiveStore(useCallback((s) => s.currentRoomID, []));
  const rooms = useArchiveStore(useCallback((s) => s.rooms, []));
  const archiveInfo = useArchiveStore(useCallback((s) => s.archiveInfo, []));
  const { push } = useRouter();

  const archiveID = archiveInfo?.archiveID || "";

  const handlePrevClick = () => {
    const keys = Object.keys(rooms);
    const currentIndex = currentRoomID ? keys.indexOf(currentRoomID) : -1;
    if (isHome) {
      push(`/archive/${archiveID}/${keys[keys.length - 1]}`);
      return;
    }
    if (currentIndex === 0) {
      push(`/archive/${archiveID}`);
    } else {
      push(`/archive/${archiveID}/${keys[currentIndex - 1]}`);
    }
  };

  const handleNextClick = () => {
    const keys = Object.keys(rooms);
    const currentIndex = currentRoomID ? keys.indexOf(currentRoomID) : -1;
    if (isHome) {
      push(`/archive/${archiveID}/${keys[0]}`);
      return;
    }
    if (currentIndex === keys.length - 1) {
      push(`/archive/${archiveID}`);
    } else {
      push(`/archive/${archiveID}/${keys[currentIndex + 1]}`);
    }
  };

  const currentRoom = currentRoomID ? rooms[currentRoomID] : null;

  return (
    <div className="centerh relative">
      <div className="horizontal-stack:s-2 align-end">
        <div
          className="whiteFill clickable clickable:link border padded:s-3 greenFill:hover"
          onClick={handlePrevClick}
        >
          ←
        </div>
        {isHome ? (
          <div
            className="border padded:s-3 center-text"
            style={{ backgroundColor: "var(--contrast)" }}
          >
            <span>{archiveInfo?.name} archive</span>
          </div>
        ) : currentRoom ? (
          <div
            className="border padded:s-3 center-text homepageLabelFooter homepageLabelInverse"
            style={{
              backgroundColor: currentRoom.roomColor,
              "--bg": currentRoom.roomColor,
            } as React.CSSProperties}
          >
            <span>{currentRoom.roomName} is looping</span>
          </div>
        ) : null}
        <div
          className="whiteFill clickable clickable:link border padded:s-3 greenFill:hover"
          onClick={handleNextClick}
        >
          →
        </div>
      </div>
    </div>
  );
};

const SCAN_INTERVAL = 30;

const ArchiveScanButton: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(SCAN_INTERVAL);

  useEffect(() => {
    if (!isScanning) { setTimeLeft(SCAN_INTERVAL); return; }
    const interval = setInterval(onNext, SCAN_INTERVAL * 1000);
    const countdown = setInterval(() => setTimeLeft((t) => Math.max(0, t - 0.1)), 100);
    return () => { clearInterval(interval); clearInterval(countdown); };
  }, [isScanning, onNext]);

  return (
    <div
      className="whiteFill clickable border padded:s-3 greenFill:hover"
      onClick={() => setIsScanning((s) => !s)}
    >
      {isScanning ? `next in ${Math.ceil(timeLeft)}s` : "scan"}
    </div>
  );
};

const ArchiveHomeButton: React.FC = () => {
  const archiveInfo = useArchiveStore(useCallback((s) => s.archiveInfo, []));
  const currentRoomID = useArchiveStore(useCallback((s) => s.currentRoomID, []));
  const archiveID = archiveInfo?.archiveID || "";

  return currentRoomID ? (
    <Link href={`/archive/${archiveID}`} passHref>
      <div className="padded:s-3 border clickable whiteFill greenFill:hover">
        home
      </div>
    </Link>
  ) : (
    <Link href="/" passHref>
      <div className="padded:s-3 border clickable whiteFill greenFill:hover">
        /
      </div>
    </Link>
  );
};

export default ArchiveFooter;
