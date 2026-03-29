import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import ArchiveProvider from "../../../components/archive/archiveProvider";
import ArchiveFooter from "../../../components/archive/archiveFooter";
import ArchiveRoomPage from "../../../components/archive/archiveRoomPage";

const ArchiveRoomRoute: NextPage = () => {
  const router = useRouter();
  const { archiveID, roomID } = router.query;

  if (
    !archiveID ||
    typeof archiveID !== "string" ||
    !roomID ||
    typeof roomID !== "string"
  ) {
    return null;
  }

  return (
    <ArchiveProvider archiveID={archiveID}>
      <Head>
        <title>THING — archive</title>
      </Head>
      <ArchiveRoomPage roomID={roomID} />
      <ArchiveFooter />
    </ArchiveProvider>
  );
};

export default ArchiveRoomRoute;
