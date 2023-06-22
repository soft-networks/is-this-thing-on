import { NextPage } from "next";
import { useRouter } from "next/router";
import Room from "../../components/room/room";
import RoomGate, { RoomOnlineGate } from "../../components/roomGate";
import Layout from "../../components/room/layout";
import VideoPlayer from "../../components/videoPlayer";
import { useRoomStore } from "../../stores/roomStore";
import { useCallback, useEffect, useRef, useState } from "react";
import { Unsubscribe } from "firebase/firestore";
import { syncRoomInfoDB } from "../../lib/firestore";

const VideoOnlyPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  if (!id || typeof id !== "string") {
    return <div className="fullBleed darkFill"> something went wrong </div>;
  }
  console.log(id);
  return <VideoOnlyPageInternal roomID={id as string} />;
};

const VideoOnlyPageInternal = ({ roomID }: { roomID: string }) => {
  const changeRoom = useRoomStore(useCallback((state) => state.changeRoom, []));
  const roomInfo = useRoomStore(useCallback((s) => s.roomInfo, []));
  const unsubscribeFromRoomInfo = useRef<Unsubscribe>();
  const [userClicked, setUserClicked] = useState(false);

  useEffect(() => {
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
  }, [changeRoom, roomID]);
  return (
    <Layout hideChat hideFooter>
      <RoomGate id={roomID}>
        <RoomOnlineGate>
          <div className="fullBleed noOverflow">
            {!userClicked && (
              <div
                className="centerh border-thin whiteFill padded:s-2 clickable contrastFill:hover"
                onClick={() => setUserClicked(true)}
              >
                click to play
              </div>
            )}
            {userClicked && roomInfo && (
              <>
                <VideoPlayer
                  style={{}}
                  className="fullBleed noEvents absoluteOrigin"
                  streamPlaybackID={roomInfo.streamPlaybackID}
                />
              </>
            )}
            {userClicked && !roomInfo && <div className="centerh"> loading </div>}
          </div>
        </RoomOnlineGate>
      </RoomGate>
    </Layout>
  );
};

export default VideoOnlyPage;
