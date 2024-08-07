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

const Index: NextPage = () => {
  const changeRoom = useRoomStore((s) => s.changeRoom);
  const displayName = useUserStore(useCallback((s) => s.displayName, []))

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
