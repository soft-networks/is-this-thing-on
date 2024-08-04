import type { NextPage } from "next";

import Head from "next/head";
import { useEffect } from "react";
import { useRoomStore } from "../stores/roomStore";

const About: NextPage = () => {
  const changeRoom = useRoomStore((s) => s.changeRoom);

  useEffect(() => {
    changeRoom(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="whiteFill fullBleed">
      <Head>
        <title>about THING</title>
      </Head>
      <iframe
        className="fullBleed"
        src="https://drive.google.com/embeddedfolderview?id=1kQnnvjLfiySUOoV8foHPa2sKUNVrGeZm#grid "
      ></iframe>
    </div>
  );
};

export default About;
