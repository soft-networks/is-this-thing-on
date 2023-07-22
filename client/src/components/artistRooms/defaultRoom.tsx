import { useCallback } from "react";
import { useRoomStore } from "../../stores/roomStore";
import { StickerAdderProps } from "../interactive/stickerAdders";
import Stickers from "../interactive/stickers";
import VideoPlayer from "../videoPlayer";
import { Chat } from "../interactive/chat";
import AdminPanel from "../account/adminPanel";

interface RoomViewProps {
  stickerStyle?: React.CSSProperties;
  stickerChooser?: React.FC<StickerAdderProps>
  chatStyle?: React.CSSProperties
}
const DefaultRoom = ({ stickerStyle , stickerChooser, chatStyle}: RoomViewProps) => {
  const roomInfo = useRoomStore(useCallback((s) => s.roomInfo, []));
  return (
    <main className="fullBleed noOverflow relative">
      {roomInfo ? (
        <>
          <Chat className=" absoluteOrigin" key={`${roomInfo.roomID}-chat`} style={chatStyle} />
          <VideoPlayer/>
          <Stickers style={stickerStyle} StickerChooser={stickerChooser} />
          <AdminPanel/>
        </>
      ) : (
        <div className="centerh"> loading </div>
      )}
    </main>
  );
};

export default DefaultRoom;