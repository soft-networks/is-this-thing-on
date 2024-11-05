import { useCallback, useEffect, useState } from "react";

import AdminStreamPanel from "../../components/account/adminStreamPanel";
import { getRoomsWhereUserISAdmin } from "../../lib/firestore";
import { useRouter } from "next/router";
import { useUserStore } from "../../stores/userStore";

/**
 * This page allows room administrators to create (or rejoin) a livestream and stream their audio/video directly from the browser using WebRTC.
 * This is noticably faster than traditional RTMP.
 *
 * When this page is opened, it calls the server API to:
 *   1. Generate a short-lived Stream admin user token. This is necessary to stream from the account.
 *   2. Get or generate the Stream call ID. If the stream_playback_id is set in Firestore, we will use that; otherwise we start a new Livestream call.
 *
 */
const StreamLive = () => {
  const router = useRouter();
  const [roomInfo, setRoomInfo] = useState<{
    info?: RoomInfo;
    error?: Error;
    isLoading: boolean;
  }>({
    isLoading: true,
  });

  const currentUser = useUserStore(
    useCallback((state) => state.currentUser, []),
  );

  useEffect(() => {
    if (!router.query.id || !roomInfo.isLoading) {
      return;
    }

    if (!currentUser) {
      setRoomInfo({
        error: new Error("You must log in to visit this page."),
        isLoading: false,
      });
      return;
    }

    getRoomsWhereUserISAdmin(currentUser.uid)
      .then((rooms) => {
        setRoomInfo({
          info: rooms?.find((room) => room.roomID === router.query.id),
          isLoading: false,
        });
      })
      .catch((err) => {
        setRoomInfo({
          error: err,
          isLoading: false,
        });
      });
  }, [router.query, currentUser]);

  if (roomInfo.isLoading) {
    return (
      <div className="fullBleed center:children">
        <p>Loading room info...</p>
      </div>
    );
  } else if (roomInfo.error) {
    return (
      <div className="fullBleed center:children">
        <p>{roomInfo.error.message}</p>
      </div>
    );
  } else if (!roomInfo.info) {
    return (
      <div className="fullBleed center:children">
        <p>oops! ur lost.</p>
      </div>
    );
  } else {
    return <AdminStreamPanel roomID={roomInfo.info.roomID} />;
  }
};

export default StreamLive;
