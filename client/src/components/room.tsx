
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRoomStore } from "../stores/roomStore";
import { setUserHeartbeat, syncRoomInfoDB } from "../lib/firestore";
import { Unsubscribe } from "firebase/auth";
import { useUserStore } from "../stores/userStore";
import VideoPlayer from "./videoPlayer";
import RoomGate, { RoomOnlineGate } from "./roomGate";
import useStickerCDNStore from "../stores/stickerStore";
import Stickers from "./stickers";
import Layout from "../layouts/layout";
import Ambient from "./rooms/ambient";
import Compromised from "./rooms/compromised";
import Maya from "./rooms/maya";
import Chris from "./rooms/chris";
import { StickerAdderProps } from "./stickerAdders";
import Molly from "./rooms/molly";

const Room: React.FC<{ roomID: string; season?: number}> = ({ roomID, season }) => {
  const changeRoom = useRoomStore(useCallback((state) => state.changeRoom, []));
  const changeRoomStickers = useStickerCDNStore(useCallback((state) => state.changeRoomStickers, []));
  const unsubscribeFromRoomInfo = useRef<Unsubscribe>();
  const currentUser = useUserStore(useCallback((state) => state.currentUser, []));
  const roomInfo = useRoomStore(useCallback(state => state.roomInfo, []));
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
    <Layout>
    <RoomGate id={roomID as string}>
      <RoomOnlineGate>
        {season == 0 || season == undefined || roomInfo?.forceSeason0 ? <SeasonZero /> : <SeasonOne roomID={roomID} />}
      </RoomOnlineGate>
    </RoomGate>
    </Layout>
  );
};
const SeasonOne = ({ roomID }: { roomID: string }) => {
  if (roomID == "compromised") {
    return <Compromised/>
  }
  if (roomID == "maya") {
    return <Maya/>
  }
  if (roomID == "ambient") {
    return <Ambient/>
  }
  if (roomID == "chrisy") {
    return <Chris/>
  }
  if (roomID == "molly") {
    return <Molly/>
  }
  return <RoomView />;
};
const SeasonZero: React.FC = () => {
  const roomInfo = useRoomStore(useCallback((s) => s.roomInfo, []));
  if (roomInfo?.roomID == "WORKSHOP") {
    return (
      <div className="fullBleed">
        <div className="center:absolute highest">
          join our{" "}
          <a href={roomInfo?.season0Href} target="_blank" rel="noreferrer">
            salon on zoom
          </a>
        </div>
      </div>
    );
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
export const RoomView = ({ videoContainerStyle: videoStyle, stickerStyle , stickerChooser}: RoomViewProps) => {
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
