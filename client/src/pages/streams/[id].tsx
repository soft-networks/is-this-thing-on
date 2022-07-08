import type { NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "../../layouts/layout";
import StreamNameGate from "../../components/streamNameGate";
import RoomInfoViewer from "../../components/roomInfoViewer";
import { Chat } from "../../components/chat";
import { useCallback, useEffect, useRef } from "react";
import { useRoomStore } from "../../stores/roomStore";
import {  setUserHeartbeat, syncRoomInfoDB } from "../../lib/firestore";
import { Unsubscribe } from "firebase/auth";
import { useUserStore } from "../../stores/userStore";


const StreamPage: NextPage = () => {

  const changeRoom = useRoomStore(state => state.changeRoom);
  const unsubscribeFromRoomInfo = useRef<Unsubscribe>();
  const currentUser = useUserStore(useCallback(state => state.currentUser, []));
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    //TODO: This is slightly innefficient, doesnt have to detach to reattach
    if (currentUser && id && (typeof id === 'string')) {
      setUserHeartbeat(currentUser.uid, id);
    } 
  }, [currentUser, id])
  useEffect(() => {
    //TODO: Actual edge cases here
    async function subscribeToRoomInfo(){
      if (id && (typeof id === 'string' )) {
        if (unsubscribeFromRoomInfo.current) {
          unsubscribeFromRoomInfo.current();
        }
        unsubscribeFromRoomInfo.current = await syncRoomInfoDB(id, (r) => changeRoom(id, r));
      }
      
    }
    subscribeToRoomInfo();
    return () => {
      if (unsubscribeFromRoomInfo.current) unsubscribeFromRoomInfo.current();
    };
  }, [changeRoom, id])
  return (
    <Layout>
      <StreamNameGate id={id as string} >
        <Chat/>
        <RoomInfoViewer  />
      </StreamNameGate>
    </Layout>
  );
};

export default StreamPage;
