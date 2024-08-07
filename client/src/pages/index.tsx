/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";

import Head from "next/head";
import React, { useEffect } from "react";

import { Chat } from "../components/interactive/chat";
import DomRing from "../components/rings/domRing";
import Layout from "../components/room/layout";
import { useRoomStore } from "../stores/roomStore";

const Index: NextPage = () => {
  const changeRoom = useRoomStore((s) => s.changeRoom);
  useEffect(() => {
    changeRoom(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <div
        className="fullBleed lightFill  relative stack backgroundFIll"
        style={{ "--roomColor": "yellow" } as React.CSSProperties}
      >
        <Head>
          <title>THING</title>
        </Head>
        <div className="fullBleed noOverflow">
          <DomRing />
          <div className="center:absolute highestLayer center-text">
            is this thing on?
          </div>
        </div>
        <Chat key="index-chat" />
      </div>
    </Layout>
  );
};

export default Index;
