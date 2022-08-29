import Layout from "../layouts/layout";
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

const Room: React.FC<{ roomID: string }> = ({ roomID }) => {
  const changeRoom = useRoomStore((state) => state.changeRoom);
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
      if (roomID && typeof roomID === "string") {
        if (unsubscribeFromRoomInfo.current) {
          unsubscribeFromRoomInfo.current();
        }
        unsubscribeFromRoomInfo.current = await syncRoomInfoDB(roomID, (r) => changeRoom(roomID, r));
      }
    }
    subscribeToRoomInfo();
    return () => {
      if (unsubscribeFromRoomInfo.current) unsubscribeFromRoomInfo.current();
    };
  }, [changeRoom, roomID]);

  const RoomLayout = useMemo(() => {
    switch (roomID) {
      case "chris":
        return <Chris />;
      case "molly":
        return <Molly/>;
      default:
        return (
          <div className="stack quarterWidth">
            <RoomInfoViewer />
            <Stream/>
            <Chat />
          </div>
        );
    }
  }, [roomID]);

  return (
    <Layout>
      <RoomGate id={roomID as string}>{RoomLayout}</RoomGate>
    </Layout>
  );
};

export default Room;
