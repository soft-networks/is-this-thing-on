import { useCallback, useEffect } from "react";
import useArchiveStore, { archiveRoomToSummary } from "../../stores/archiveStore";
import { useRoomStore } from "../../stores/currentRoomStore";
import useMediaQuery from "../../stores/useMediaQuery";
import { Chat } from "../interactive/chat";
import VideoPlayer from "../video/videoPlayer";

const ArchiveRoomPage: React.FC<{ roomID: string }> = ({ roomID }) => {
  const rooms = useArchiveStore(useCallback((s) => s.rooms, []));
  const setCurrentRoom = useArchiveStore(useCallback((s) => s.setCurrentRoom, []));
  const changeRoom = useRoomStore((s) => s.changeRoom);
  const updateCurrentRoomInfo = useRoomStore((s) => s.updateCurrentRoomInfo);
  const isMobile = useMediaQuery();

  const room = rooms[roomID];

  useEffect(() => {
    if (room) {
      setCurrentRoom(roomID);
      const summary = archiveRoomToSummary(room);
      // Set the current room store so VideoPlayer and Chat can read from it
      changeRoom(roomID);
      updateCurrentRoomInfo({
        ...summary,
        consentURL: undefined,
        streamOwner: "",
      });
    }
    return () => {
      setCurrentRoom(null);
    };
  }, [roomID, room, setCurrentRoom, changeRoom, updateCurrentRoomInfo]);

  if (!room) {
    return <div className="fullBleed center-text">archive room not found</div>;
  }

  return (
    <main className="fullBleed noOverflow relative" style={{ "--roomColor": room.roomColor } as React.CSSProperties}>
      {isMobile ? (
        <ArchiveRoomMobile room={room} />
      ) : (
        <ArchiveRoomDesktop room={room} />
      )}
    </main>
  );
};

const ArchiveRoomDesktop: React.FC<{ room: ArchiveRoomInfo }> = ({ room }) => (
  <>
    <Chat key={`${room.roomID}-chat`} />
    <VideoPlayer />
  </>
);

const ArchiveRoomMobile: React.FC<{ room: ArchiveRoomInfo }> = ({ room }) => (
  <div className="fullBleed stack:noGap noOverflow">
    <div style={{ height: "40%", width: "100%", position: "relative" }}>
      <VideoPlayer />
    </div>
    <div className="flex-1 relative">
      <Chat key={`${room.roomID}-chat`} />
    </div>
  </div>
);

export default ArchiveRoomPage;
