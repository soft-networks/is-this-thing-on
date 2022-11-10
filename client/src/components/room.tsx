
import { useCallback, useEffect, useRef } from "react";
import { useRoomStore } from "../stores/roomStore";
import { setUserHeartbeat, syncRoomInfoDB } from "../lib/firestore";
import { Unsubscribe } from "firebase/auth";
import { useUserStore } from "../stores/userStore";
import VideoPlayer from "./videoPlayer";
import RoomGate, { RoomOnlineGate } from "./roomGate";
import useStickerCDNStore from "../stores/stickerStore";
import Stickers from "./stickers";
import Head from "next/head";

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
  if (roomID == "chris") {
    let doubleSizeStyle: React.CSSProperties = {
      width: "calc(2 * 100vw)",
      height: "calc(2 *56vw)",
      zIndex: 0,
    };
    return <RoomView videoStyle={doubleSizeStyle} stickerStyle={doubleSizeStyle} />;
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
  videoStyle?: React.CSSProperties;
  stickerStyle?: React.CSSProperties;
}
const RoomView = ({ videoStyle, stickerStyle }: RoomViewProps) => {
  const roomInfo = useRoomStore(useCallback((s) => s.roomInfo, []));

  return (
    <div className="fullBleed overflowScroll">
      <Head><title>{roomInfo?.roomName} is {roomInfo?.streamStatus == "active" ? "ON": "OFF"}</title></Head>
      {roomInfo ? (
        <>
          <VideoPlayer style={videoStyle} className="fullBleed noEvents absoluteOrigin" streamPlaybackID={roomInfo.streamPlaybackID} />
          <Stickers style={stickerStyle} />
        </>
      ) : (
        <div className="centerh"> loading </div>
      )}
    </div>
  );
};
export default Room;
