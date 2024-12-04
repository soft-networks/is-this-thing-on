import { NextPage } from "next";

import { useCallback, useEffect } from "react";

import Auth from "../components/account/auth";
import Layout from "../components/layout";
import { useRoomStore } from "../stores/roomStore";

const Account: NextPage = () => {
  const changeRoom = useRoomStore(useCallback((state) => state.changeRoom, []));

  useEffect(() => {
    changeRoom(null, undefined);
  }, [changeRoom]);
  return <Auth />;
};

export default Account;
