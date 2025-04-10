/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import Head from "next/head";
import React, { useCallback, useEffect } from "react";
import { Chat } from "../components/interactive/chat";
import Layout from "../components/layout";
import { useRoomStore } from "../stores/currentRoomStore";
import { useGlobalUserStore } from "../stores/globalUserStore";
import { activePresenceHeartbeat, setUserPresenceHeartbeat } from "../lib/firestore";
import useMediaQuery from "../stores/useMediaQuery";
import DomRing from "../components/rings/domRing";
import Link from "next/link";

const Index: NextPage = () => {
  const changeRoom = useRoomStore((s) => s.changeRoom);
  const isMobile = useMediaQuery();
  useEffect(() => {
    changeRoom(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Head>
        <title>THING</title>
      </Head>
      {isMobile ? <IndexMobile /> : <IndexDesktop />}
    </>
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
        <div className="center:absolute highestLayer center-text faintWhite">
          <CenterText />
        </div>
      </div>
      {/* Comment out the line below to remove the chat */}
      <Chat key="index-chat" />
    </div>
  );
};

const IndexMobile = () => {
  return (
    <div className="fullBleed stack noOverflow">
      <div style={{ height: "40%", width: "100%", position: "relative" }}>
        <DomRing />
        <div className="center:absolute highestLayer center-text faintWhite">
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
    is this <br/>
    thing on?
  </>
)


export default Index;
