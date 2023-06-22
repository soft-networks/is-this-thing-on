
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRoomStore } from "../../stores/roomStore";
import { setUserHeartbeat, syncRoomInfoDB } from "../../lib/firestore";
import { Unsubscribe } from "firebase/auth";
import { useUserStore } from "../../stores/userStore";
import RoomGate, { RoomOnlineGate } from "./roomGate";
import useStickerCDNStore from "../../stores/stickerStore";
import Layout from "./layout";
import Ambient from "../artistRooms/ambient";
import Compromised from "../artistRooms/compromised";
import Maya from "../artistRooms/maya";
import Chris from "../artistRooms/chris";
import Molly from "../artistRooms/molly";
import Sarah from "../artistRooms/sarah";
import Darla from "../artistRooms/darla";
import DefaultRoom from "../artistRooms/defaultRoom";

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
        <SeasonOne roomID={roomID} />
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
  if (roomID == "sarah")  {
    return <Sarah/>
  }
  if (roomID == "messydarla") {
    return <Darla/>
  }
  return <DefaultRoom />;
};

export default Room;
