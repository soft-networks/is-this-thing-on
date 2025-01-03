import { Chat } from "../interactive/chat";
import { StickerAdderProps } from "../interactive/stickerAdders";
import Stickers from "../interactive/stickers";
import VideoPlayer from "../video/videoPlayer";
import { useCallback } from "react";
import useMediaQuery from "../../stores/useMediaQuery";
import { useRoomStore } from "../../stores/currentRoomStore";

interface RoomViewProps {
  stickerStyle?: React.CSSProperties;
  stickerChooser?: React.FC<StickerAdderProps>;
  chatStyle?: React.CSSProperties;
}

const DefaultRoomMobileContent = ({
  chatStyle,
  roomInfo,
}: RoomViewProps & { roomInfo: any }) => (
  <div className="fullBleed stack noOverflow">
    <div style={{ height: "40%", width: "100%", position: "relative" }}>
      <VideoPlayer/>
    </div>
    <div className="flex-1 relative">
      <Chat key={`${roomInfo.roomID}-chat`} style={chatStyle} />
    </div>
  </div>
);

const DefaultRoomDesktopContent = ({
  stickerStyle,
  stickerChooser,
  chatStyle,
  roomInfo,
}: RoomViewProps & { roomInfo: any }) => (
  <>
    {/* Comment out the line below to remove the chat */}
    <Chat key={`${roomInfo.roomID}-chat`} style={chatStyle} />
    <VideoPlayer />
    {/* <Stickers style={stickerStyle} StickerChooser={stickerChooser} /> */}
  </>
);

const DefaultRoom = (props: RoomViewProps) => {
  const isMobile = useMediaQuery();
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
