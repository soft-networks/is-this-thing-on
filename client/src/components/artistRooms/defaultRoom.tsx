import { useCallback } from "react";
import { useMediaQuery } from 'react-responsive';
import { useRoomStore } from "../../stores/roomStore";
import AdminPanel from "../account/adminPanel";
import { Chat } from "../interactive/chat";
import { StickerAdderProps } from "../interactive/stickerAdders";
import Stickers from "../interactive/stickers";
import VideoPlayer from "../videoPlayer";

interface RoomViewProps {
  stickerStyle?: React.CSSProperties;
  stickerChooser?: React.FC<StickerAdderProps>;
  chatStyle?: React.CSSProperties;
}


const DefaultRoomMobileContent = ({ chatStyle, roomInfo }: RoomViewProps & { roomInfo: any }) => (
  <div className="fullBleed stack">
    <Chat key={`${roomInfo.roomID}-chat`} style={chatStyle} />
  </div>
);

const DefaultRoomDesktopContent = ({
  stickerStyle,
  stickerChooser,
  chatStyle,
  roomInfo,
}: RoomViewProps & { roomInfo: any }) => (
  <>
    <Chat key={`${roomInfo.roomID}-chat`} style={chatStyle} />
    <VideoPlayer />
    <Stickers style={stickerStyle} StickerChooser={stickerChooser} />
    <AdminPanel />
  </>
);

const DefaultRoom = (props: RoomViewProps) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const roomInfo = useRoomStore(useCallback((s) => s.roomInfo, []));

  return (
    <main className="fullBleed noOverflow relative">
      {roomInfo ? (
        isMobile ? (
          <DefaultRoomMobileContent {...props} roomInfo={roomInfo} />
        ) : (
          <DefaultRoomDesktopContent {...props} roomInfo={roomInfo} />
        )
      ) : (
        <div className="centerh"> loading </div>
      )}
    </main>
  );
};


export default DefaultRoom;
