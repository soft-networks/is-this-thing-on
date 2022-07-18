import Layout from "../layouts/layout";
import StreamNameGate from "./streamNameGate";
import RoomInfoViewer from "./roomInfoViewer";
import { Chat } from "./chat";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRoomStore } from "../stores/roomStore";
import { setUserHeartbeat, syncRoomInfoDB } from "../lib/firestore";
import { Unsubscribe } from "firebase/auth";
import { useUserStore } from "../stores/userStore";
import Chris from "./rooms.tsx/chris";
import VideoPlayer from "./videoPlayer";

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
      default:
        return (
          <div className="stack quarterWidth">
            <RoomInfoViewer />
            <VideoPlayer/>
            <Chat />
          </div>
        );
    }
  }, [roomID]);

  return (
    <Layout>
      <StreamNameGate id={roomID as string}>{RoomLayout}</StreamNameGate>
    </Layout>
  );
};

export default Room;
