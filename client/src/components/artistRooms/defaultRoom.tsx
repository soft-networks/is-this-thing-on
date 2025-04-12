import { Chat } from "../interactive/chat";
import {  EmptyChooser, RandomStickerAdder, StickerAdderProps } from "../interactive/stickerAdders";
import { MobileStickerAdder } from "../interactive/mobileStickers";
import Stickers from "../interactive/stickers";
import VideoPlayer from "../video/videoPlayer";
import { useCallback } from "react";
import useMediaQuery from "../../stores/useMediaQuery";
import { useRoomStore } from "../../stores/currentRoomStore";
import { useMuseumMode } from "../../stores/useMuseumMode";

interface RoomViewProps {
  stickerStyle?: React.CSSProperties;
  stickerChooser?: React.FC<StickerAdderProps>;
  chatStyle?: React.CSSProperties;
}

const DefaultRoomMobileContent = ({
  chatStyle,
  roomInfo,
}: RoomViewProps & { roomInfo: any }) => (
  <div className="fullBleed stack:noGap noOverflow">
    <div style={{ height: "40%", width: "100%", position: "relative" }}>
      <VideoPlayer muteOverride={roomInfo.roomID === "you"}/>
      <Stickers StickerChooser={EmptyChooser}/>
    </div>
    <MobileStickerAdder />
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
  hideMuteButton,
}: RoomViewProps & { roomInfo: any, hideMuteButton: boolean }) => (
  
  <>
    {/* Comment out the line below to remove the chat */}
    <Chat key={`${roomInfo.roomID}-chat`} style={chatStyle} />
    <VideoPlayer  hideMuteButton={hideMuteButton} muteOverride={roomInfo.roomID === "you"} />
    <Stickers style={stickerStyle} StickerChooser={stickerChooser} />
  </>
);

const DefaultRoom = (props: RoomViewProps) => {
  const isMobile = useMediaQuery();
  const roomInfo = useRoomStore(useCallback((s) => s.roomInfo, []));
  const { isMuseumMode, isProjectorMode } = useMuseumMode();

  return (
    <main className="fullBleed noOverflow relative">
      {roomInfo ? (
        isMobile && !isMuseumMode ? (
          <DefaultRoomMobileContent {...props} roomInfo={roomInfo} />
        ) : (
          <DefaultRoomDesktopContent {...props} roomInfo={roomInfo} hideMuteButton={isMuseumMode || isProjectorMode}/>
        )
      ) : (
        <div className="centerh"> loading </div>
      )}
    </main>
  );
};

export default DefaultRoom;
