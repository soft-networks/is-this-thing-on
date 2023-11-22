/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRoomStore } from "../stores/roomStore";
import Layout from "../components/room/layout";
import BigRing from "../components/rings/bigRing";
import { Chat } from "../components/interactive/chat";

const Index: NextPage = () => {
  const changeRoom = useRoomStore((s) => s.changeRoom);
  useEffect(() => {
    changeRoom(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <div className="fullBleed relative stack backgroundFIll">
        <Head>
          <title>THING</title>
        </Head>
        <div className="flex-1 center-text">
          <BigRing />
        </div>
        <Chat key="index-chat" />
      </div>
    </Layout>
  );
};

export default Index;
