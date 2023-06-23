import { useCallback } from "react";
import { useRoomStore } from "../../stores/roomStore";
import { StickerAdderProps } from "../interactive/stickerAdders";
import Stickers from "../interactive/stickers";
import VideoPlayer from "../videoPlayer";
import { Chat } from "../interactive/chat";

interface RoomViewProps {
  stickerStyle?: React.CSSProperties;
  stickerChooser?: React.FC<StickerAdderProps>
}
const DefaultRoom = ({ stickerStyle , stickerChooser}: RoomViewProps) => {
  const roomInfo = useRoomStore(useCallback((s) => s.roomInfo, []));

  return (
    <div className="fullBleed noOverflow">
      {roomInfo ? (
        <>
          <Chat className=" absoluteOrigin" key="chat" />
          <VideoPlayer />
          <Stickers style={stickerStyle} StickerChooser={stickerChooser}/>
        </>
      ) : (
        <div className="centerh"> loading </div>
      )}
    </div>
  );
};

export default DefaultRoom;