import RoomInfoViewer from "./roomInfo";
import { Chat } from "./chat";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRoomStore } from "../stores/roomStore";
import { setUserHeartbeat, syncRoomInfoDB } from "../lib/firestore";
import { Unsubscribe } from "firebase/auth";
import { useUserStore } from "../stores/userStore";
import Chris from "./rooms/chris";
import VideoPlayer from "./videoPlayer";
import Molly from "./rooms/molly";
import RoomGate from "./roomGate";
import useRingStore from "../stores/ringStore";
import useStickerCDNStore from "../stores/stickerStore";
import Stickers from "./stickers";

const Room: React.FC<{ roomID: string }> = ({ roomID }) => {
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
      <SeasonOne roomID={roomID}/>
      {/* <SeasonZero  /> */}
    </RoomGate>
  );
};

const SeasonOne = ({roomID}: {roomID: string}) => {
  if (roomID == "chris") {
    let doubleSizeStyle: React.CSSProperties = {
      width: "calc(2 * 100vw)",
      height: "calc(2 *56vw)",
      zIndex: 0,
    };
    let chatStyle: React.CSSProperties = {
      "--chatAuthorColor": "hotpink",
      "--chatContainerBackground": "rgba(0,0,0,0.6)",
      "--chatMessageColor": "var(--white)",
      zIndex: 3,
    } as React.CSSProperties;
    return <RoomView videoStyle={doubleSizeStyle} chatStyle={chatStyle} stickerStyle={doubleSizeStyle} />
  }
  return <RoomView/>
}
const SeasonZero: React.FC = () => {
  const roomInfo = useRoomStore(useCallback((s) => s.roomInfo, []));

  return roomInfo ? (
    roomInfo.streamStatus == "active" ? (
      <div className="fullBleed">
        <iframe
          className="fullBleed"
          src={
            roomInfo?.streamPlaybackID ||
            "http://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1&origin=http://example.com"
          }
        />{" "}
      </div>
    ) : (
      <div className="fullBleed">
        <div className="center:absolute"> ... </div>
      </div>
    )
  ) : (
    <div> </div>
  );
};


interface RoomViewProps {
  chatStyle?: React.CSSProperties,
  videoStyle?: React.CSSProperties,
  stickerStyle?: React.CSSProperties
}
const RoomView = ({ chatStyle, videoStyle, stickerStyle }: RoomViewProps) => {
  return (
    <div className="fullBleed overflowScroll">
      <VideoPlayer style={videoStyle} className="fullBleed noEvents absoluteOrigin" />
      <Chat className="quarterWidth absoluteOrigin highest" style={chatStyle} />
      <Stickers style={stickerStyle} />
    </div>
  );
};
export default Room;
