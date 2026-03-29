import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import { Chat } from "../../../components/interactive/chat";
import { useRoomStore } from "../../../stores/currentRoomStore";
import useMediaQuery from "../../../stores/useMediaQuery";
import ArchiveDomRing from "../../../components/archive/archiveDomRing";
import ArchiveProvider from "../../../components/archive/archiveProvider";
import ArchiveFooter from "../../../components/archive/archiveFooter";
import useArchiveStore from "../../../stores/archiveStore";

const ArchiveIndex: NextPage = () => {
  const router = useRouter();
  const { archiveID } = router.query;
  const changeRoom = useRoomStore((s) => s.changeRoom);

  useEffect(() => {
    changeRoom(null);
  }, [changeRoom]);

  if (!archiveID || typeof archiveID !== "string") {
    return null;
  }

  return (
    <ArchiveProvider archiveID={archiveID}>
      <Head>
        <title>THING — archive</title>
      </Head>
      <ArchiveHome />
      <ArchiveFooter />
    </ArchiveProvider>
  );
};

const ArchiveHome = () => {
  const isMobile = useMediaQuery();
  return isMobile ? <ArchiveHomeMobile /> : <ArchiveHomeDesktop />;
};

const ArchiveHomeDesktop = () => {
  return (
    <div
      className="fullBleed lightFill relative stack backgroundFIll"
      style={{ "--roomColor": "yellow" } as React.CSSProperties}
    >
      <div className="fullBleed noOverflow">
        <ArchiveDomRing />
        <div className="center:absolute highestLayer center-text">
          <ArchiveCenterText />
        </div>
      </div>
      <Chat key="archive-chat" />
    </div>
  );
};

const ArchiveHomeMobile = () => {
  return (
    <div className="fullBleed stack noOverflow">
      <div style={{ height: "40%", width: "100%", position: "relative" }}>
        <ArchiveDomRing />
        <div className="center:absolute highestLayer center-text">
          <ArchiveCenterText />
        </div>
      </div>
      <div className="flex-1 relative">
        <Chat key="archive-chat" />
      </div>
    </div>
  );
};

const ArchiveCenterText = () => {
  const archiveInfo = useArchiveStore(useCallback((s) => s.archiveInfo, []));
  if (!archiveInfo) return null;
  return (
    <>
      {archiveInfo.description}
      {archiveInfo.moreURL && (
        <div>
          <a href={archiveInfo.moreURL} target="_blank" rel="noopener noreferrer" className="underline">
            more info?
          </a>
        </div>
      )}
    </>
  );
};

export default ArchiveIndex;
