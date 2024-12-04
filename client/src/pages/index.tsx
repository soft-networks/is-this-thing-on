/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import Head from "next/head";
import React, { useCallback, useEffect } from "react";
import { Chat } from "../components/interactive/chat";
import Layout from "../components/room/layout";
import { useRoomStore } from "../stores/roomStore";
import { useGlobalUserStore } from "../stores/globalUserStore";
import { activePresenceHeartbeat, setUserPresenceHeartbeat } from "../lib/firestore";
import useMediaQuery from "../stores/useMediaQuery";
import DomRing from "../components/rings/domRing";
import Link from "next/link";

const Index: NextPage = () => {
  const changeRoom = useRoomStore((s) => s.changeRoom);
  const displayName = useGlobalUserStore(useCallback((s) => s.displayName, []))
  const isMobile = useMediaQuery();

  useEffect(() => {
    changeRoom(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    if (displayName) {
      setUserPresenceHeartbeat(displayName, "home");
    }
    return () => {
      // Clear the active timeout when unmounting or changing rooms
      if (activePresenceHeartbeat) {
        clearTimeout(activePresenceHeartbeat);
      }
    };
  }, [displayName]);


  return (
    <Layout>
      <Head>
        <title>THING</title>
      </Head>
      {isMobile ? <IndexMobile /> : <IndexDesktop />}
    </Layout>
  );
};

const IndexDesktop = () => {
  return (
    <div
      className="fullBleed lightFill  relative stack backgroundFIll"
      style={{ "--roomColor": "yellow" } as React.CSSProperties}
    >
      <div className="fullBleed noOverflow">
        <DomRing />
        <div className="center:absolute highestLayer center-text">
          <CenterText />
        </div>
      </div>
      <Chat key="index-chat" />
    </div>
  );
};

const IndexMobile = () => {
  return (
    <div className="fullBleed stack noOverflow">
      <div style={{ height: "40%", width: "100%", position: "relative" }}>
        <DomRing />
        <div className="center:absolute highestLayer center-text">
          <CenterText />
        </div>
      </div>
      <div className="flex-1 relative">
        <Chat key={`index-chat`} />
      </div>
    </div>
  );
};

const CenterText = () => (
  <>
    next stream: dec 29
    <Link href="https://docs.google.com/forms/d/e/1FAIpQLSdfDAp4BTtW1RZKcfJX3xArCa3cVEJTpMQgd7fz0M5c5_yLlg/viewform?usp=sf_link" className="underline">
    <br/>
      stream nothing with us?
    </Link>
  </>
)


export default Index;
