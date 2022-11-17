
import { useCallback, useEffect, useRef } from "react";
import { useRoomStore } from "../stores/roomStore";
import { setUserHeartbeat, syncRoomInfoDB } from "../lib/firestore";
import { Unsubscribe } from "firebase/auth";
import { useUserStore } from "../stores/userStore";
import VideoPlayer from "./videoPlayer";
import RoomGate, { RoomOnlineGate } from "./roomGate";
import useStickerCDNStore from "../stores/stickerStore";
import Stickers, { StaticStickerAdder, StickerAdderProps } from "./stickers";

const Room: React.FC<{ roomID: string; season?: number }> = ({ roomID, season }) => {
  const changeRoom = useRoomStore(useCallback((state) => state.changeRoom, []));
  const changeRoomStickers = useStickerCDNStore(useCallback((state) => state.changeRoomStickers, []));
  const unsubscribeFromRoomInfo = useRef<Unsubscribe>();
  const currentUser = useUserStore(useCallback((state) => state.currentUser, []));
  useEffect(() => {
    //TODO: This is slightly innefficient, doesnt have to detach to reattach
    if (currentUser) {
      setUserHeartbeat(currentUser.uid, roomID);
    }
  }, [currentUser, roomID]);
  useEffect(() => {
    //TODO: Actual edge cases here
    async function subscribeToRoomInfo() {
      if (roomID !== undefined) {
        if (unsubscribeFromRoomInfo.current) {
          unsubscribeFromRoomInfo.current();
        }
        unsubscribeFromRoomInfo.current = await syncRoomInfoDB(roomID, (r) => changeRoom(roomID as string, r));
        changeRoomStickers(roomID);
      }
    }
    subscribeToRoomInfo();
    return () => {
      if (unsubscribeFromRoomInfo.current) unsubscribeFromRoomInfo.current();
    };
  }, [changeRoom, changeRoomStickers, roomID]);
  return (
    <RoomGate id={roomID as string}>
      <RoomOnlineGate>
        {season == 0 || season == undefined ? <SeasonZero /> : <SeasonOne roomID={roomID} />}
      </RoomOnlineGate>
    </RoomGate>
  );
};
const SeasonOne = ({ roomID }: { roomID: string }) => {
  if (roomID == "chrisy") {
    let doubleSizeStyle: React.CSSProperties = {
      width: "calc(2 * 100vw)",
      height: "calc(2 * 56.25vw)",
      zIndex: 0,
    };
    return <RoomView videoContainerStyle={doubleSizeStyle} stickerStyle={doubleSizeStyle} />;
  }
  if (roomID == "molly") {
    
    let fullHeight: React.CSSProperties = {
      width: "100%",
      height: "100%"
    }
    return (
      <RoomView videoStyle={fullHeight} videoContainerStyle={{ width: "100%", height: "100%", background: "#dcbdbb" }} stickerChooser={StaticStickerAdder} />
    );

  }
  return <RoomView />;
};
const SeasonZero: React.FC = () => {
  const roomInfo = useRoomStore(useCallback((s) => s.roomInfo, []));
  if (roomInfo?.roomID == "WORKSHOP" && roomInfo?.streamPlaybackID) {
    return <VideoPlayer className="fullBleed" />;
  }
  return (
    <div className="fullBleed">
      <iframe className="fullBleed" src={roomInfo?.season0URL} />
    </div>
  );
};

interface RoomViewProps {
  videoContainerStyle?: React.CSSProperties;
  videoStyle?: React.CSSProperties;
  stickerStyle?: React.CSSProperties;
  stickerChooser?: React.FC<StickerAdderProps>
}
const RoomView = ({ videoContainerStyle: videoStyle, stickerStyle , stickerChooser}: RoomViewProps) => {
  const roomInfo = useRoomStore(useCallback((s) => s.roomInfo, []));

  return (
    <div className="fullBleed overflowScroll">
      {roomInfo ? (
        <>
          <VideoPlayer style={videoStyle} className="fullBleed noEvents absoluteOrigin" streamPlaybackID={roomInfo.streamPlaybackID} videoStyle={videoStyle}/>
          <Stickers style={stickerStyle} StickerChooser={stickerChooser}/>
        </>
      ) : (
        <div className="centerh"> loading </div>
      )}
    </div>
  );
};
export default Room;
