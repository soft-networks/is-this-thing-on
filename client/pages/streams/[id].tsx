import type { NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "../../layouts/layout";
import StreamNameGate from "../../components/streamNameGate";
import RoomInfoViewer from "../../components/roomInfoViewer";
import { Chat } from "../../components/chat";
import { useCallback, useEffect, useRef } from "react";
import { useRoomStore } from "../../stores/roomStore";
import { syncRoomInfoDB } from "../../lib/firestore";
import { Unsubscribe } from "firebase/auth";


const StreamPage: NextPage = () => {

  const changeRoom = useRoomStore(state => state.changeRoom);
  const listenerRef = useRef<Unsubscribe>();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    async function setupListener(){
      //TODO: Actual edge cases here
      if (id && (typeof id === 'string' )) {
        if (listenerRef.current) {
          listenerRef.current();
        }
        listenerRef.current = await syncRoomInfoDB(id, (r) => changeRoom(id, r));
      }
    }
    setupListener();
    return () => { if (listenerRef.current) listenerRef.current();}
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
