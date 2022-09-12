import RoomInfoViewer from "./roomInfo";
import { Chat } from "./chat";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRoomStore } from "../stores/roomStore";
import { setUserHeartbeat, syncRoomInfoDB } from "../lib/firestore";
import { Unsubscribe } from "firebase/auth";
import { useUserStore } from "../stores/userStore";
import Chris from "./rooms/chris";
import Stream from "./stream";
import Molly from "./rooms/molly";
import RoomGate from "./roomGate";
import useRingStore from "../stores/ringStore";

const Room: React.FC<{ roomID: string }> = ({ roomID }) => {
  const changeRoom = useRoomStore((state) => state.changeRoom);
  const unsubscribeFromRoomInfo = useRef<Unsubscribe>();
  const currentUser = useUserStore(useCallback((state) => state.currentUser, []));
  const links = useRingStore(useCallback((state) => state.links, []));

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
      }
    }
    subscribeToRoomInfo();
    return () => {
      if (unsubscribeFromRoomInfo.current) unsubscribeFromRoomInfo.current();
    };
  }, [changeRoom, links, roomID]);

  const RoomLayoutSeason1 = useMemo(() => {
    switch (roomID) {
      case "chris":
        return <Chris />;
      case "molly":
        return <Molly />;
      default:
        return (
          <div className="stack quarterWidth">
            <RoomInfoViewer />
            <Stream />
            <Chat />
          </div>
        );
    }
  }, [roomID]);

  return (
    <RoomGate id={roomID as string}>
      <SeasonZero />
    </RoomGate>
  );
};

const SeasonZero: React.FC = () => {
  const roomInfo = useRoomStore(useCallback((s) => s.roomInfo, []));

  return roomInfo?.streamStatus == "active" ? (
    <div className="fullBleed">
      <iframe className="fullBleed" src={roomInfo?.streamPlaybackID || "http://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1&origin=http://example.com"} />{" "}
    </div>
  ) : (
    <div> offline </div>
  );
};

export default Room;
