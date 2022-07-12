import { useUserStore } from "../../stores/userStore";

import { useCallback, useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "../../layouts/layout";
import { getRoomAdmins } from "../../lib/firestore";
import { getStreamKey, resetRoom } from "../../lib/server-api";
import StreamNameGate from "../../components/streamNameGate";

const Admin: NextPage = () => {
  let currentUser = useUserStore(useCallback((state) => state.currentUser, []));
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout>
      <StreamNameGate id={id as string}>
        {currentUser && id && typeof id === "string" ? <AdminInternal roomID={id} /> : <div> login please </div>}
      </StreamNameGate>
    </Layout>
  );
};

const AdminInternal: NextPage<{ roomID: string }> = ({ roomID }) => {
  let currentUser = useUserStore(useCallback((state) => state.currentUser, []));
  let [admins, setAdmins] = useState<string[]>();
  let [isAdmin, setIsAdmin] = useState<boolean>(false);
  let [streamKey, setStreamKey] = useState<string>();

  useEffect(() => {
    async function fetchAdmins() {
      let roomAdmins = await getRoomAdmins(roomID);
      setAdmins(roomAdmins);
    }
    fetchAdmins();
  }, [roomID]);

  useEffect(() => {
    if (admins && currentUser && admins.includes(currentUser.uid)) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [admins, currentUser]);

  useEffect(() => {
    async function getSK() {
      if (isAdmin) {
        let sk = await getStreamKey(roomID);
        setStreamKey(sk);
      } else {
        setStreamKey("");
      }
    }
    getSK();
  }, [isAdmin, roomID]);

  return isAdmin ? (
    <div className="stack">
      <div>stream key: {streamKey}</div>
      <button
        onClick={() => {
          resetRoom(roomID);
          setStreamKey("");
        }}
      >
        reset stream key
      </button>
    </div>
  ) : (
    <div> hmmm doesnt seem like your admin for this room</div>
  );
};

export default Admin;
