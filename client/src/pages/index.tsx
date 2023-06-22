/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React, {  useEffect } from "react";
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
      <div className="fullBleed relative stack whiteFill">
        <Head>
          <title>THING</title>
        </Head>
        <div className="flex-1 contrastFill center-text" style={{ padding: "var(--s-2) 96px" } as React.CSSProperties}>
          <BigRing />
        </div>
        <Chat className="absoluteOrigin" key="chat" />
        <div className="grow-text padded:s-2" style={{ paddingTop: 0 }}>

          Is this THING on? is a live streaming network for artists being built slowly over three seasons, guided by
          public performance and conversation.{" "}
          <a
            href="https://www.instagram.com/thing.tube/
"
            target="_blank"
            rel="noreferrer"
          >
            Follow us
          </a>{" "}
          for the next THING. Learn more <Link href={"/about"}>here</Link>.
        </div>
      </div>
    </Layout>
  );
};



export default Index;
