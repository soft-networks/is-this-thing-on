import { NextPage } from "next";

import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";

const ArchiveViewer = dynamic(
  () => import("../components/archive/archiveViewer"),
  { ssr: false },
);

const Landing: NextPage = () => {
  return (
    <div className="fullBleed relative" style={{ backgroundColor: "#ececec" }}>
      <Head>
        <title>THING</title>
      </Head>
      <div
        id="desktopMessage"
        className="center:absolute uiLayer center-text stack:s2"
      >
        <Link href="/live">
          <div className="border narrow whiteFill padded:s1 stack:s2 cursor:pointer greenFill:hover">
            <div className="h1">
              WELCOME TO THING.TUBE
              <br />
            </div>
            <div className="h1 stack">
              a live stream network for artists
            </div>
            <div className="h1">
              <em className="cursor:pointer">CLICK 2 ENTER</em>
            </div>
          </div>
        </Link>
        <div className="border narrow whiteFill padded:s1 stack:s-1">
          <div className="h2">view past performances:</div>
          <ArchiveViewer />
        </div>
        <Link href="/learnmore">
          <div className="border narrow whiteFill padded:s1 stack:s2 cursor:pointer greenFill:hover">
            <div className="h2">more info?</div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Landing;
