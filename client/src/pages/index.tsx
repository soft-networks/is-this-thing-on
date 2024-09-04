/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";

import Head from "next/head";
import React, { useCallback, useEffect } from "react";

import { Chat } from "../components/interactive/chat";
import DomRing from "../components/rings/domRing";
import Layout from "../components/room/layout";
import { useRoomStore } from "../stores/roomStore";
import { useUserStore } from "../stores/userStore";
import { activePresenceHeartbeat, setUserPresenceHeartbeat } from "../lib/firestore";
import { useMediaQuery } from "react-responsive";

const Index: NextPage = () => {
  const changeRoom = useRoomStore((s) => s.changeRoom);
  const displayName = useUserStore(useCallback((s) => s.displayName, []))
  const isMobile = useMediaQuery({ maxWidth: 768 });

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
          is this thing on?
        </div>
      </div>
      <Chat key="index-chat" />
      </div>
  );
};

const IndexMobile = () => {
  return (
    <div className="fullBleed stack lightFill noOverflow" style={{width: "100vw", height: "calc(100vh - 42px)" }}>
      <div style={{height: "60%", width: "100%", position: "relative"}}>
        <DomRing />
        <div className="center:absolute highestLayer center-text">
          is this thing on?
        </div>
      </div>
      <Chat key={`index-chat`} />
    </div>
  );
};

export default Index;
