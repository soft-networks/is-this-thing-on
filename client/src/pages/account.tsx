import { NextPage } from "next";
import { useCallback, useEffect } from "react";
import Auth from "../components/auth";
import Layout from "../layouts/layout";
import { useRoomStore } from "../stores/roomStore";



const Account: NextPage = () => {
  const changeRoom = useRoomStore(useCallback((state) => state.changeRoom, []));

  useEffect(() => {
    changeRoom(null, undefined);
  }, [changeRoom])
  return (
    <Layout>
      <Auth/>
    </Layout>
  );
};

export default Account;


