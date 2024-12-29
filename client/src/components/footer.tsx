import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { useRoomStore } from "../stores/currentRoomStore";
import AccountButton from "./account/accountButton";
import { FooterRing } from "./rings/footerRing";
import { syncTotalOnline } from "../lib/firestore";
import classNames from "classnames";
import useMediaQuery from "../stores/useMediaQuery";
import useGlobalPresenceStore from "../stores/globalPresenceStore";
import { AutoScanRing } from "./rings/autoScanRing";

const Footer: React.FC = () => {
  const { pathname } = useRouter();
  const isMobile = useMediaQuery();
  return (
    <>
    <footer className={classNames("fullWidth uiLayer horizontal-stack", { "align-end:fixed": !isMobile, "relative": isMobile })}>
      <div className={classNames("uiLayer padded:s-2 overflowVisible", {
        "centerh:absolute": !isMobile
      })}>
         <FooterRing isHome={pathname == "/"}/>
      </div>
      <div
        className="uiLayer horizontal-stack:s-2 padded:s-2 align-end"
      >
        {!isMobile && <AutoScanRing />}
        <HomeButton />
      </div>
    </footer>
    <div className="uiLayer horizontal-stack:s-2 padded:s-2" style={{position: "fixed", top: "0", right: "0"}}>
      <NumOnline />
      <AccountButton />
    </div>
    </>
  );
};

const HomeButton: React.FC = () => {
  const { pathname, back } = useRouter();
  return pathname == "/" ? (
    <Link href={"/about"} passHref>
      <div className="padded:s-3 border clickable whiteFill greenFill:hover">
      about
      </div>
    </Link>
  ) : (
    <Link href={"/"} passHref>
      <div className="padded:s-3 border clickable whiteFill greenFill:hover">
      home
      </div>
    </Link>
  );
};

const NumOnline: React.FC = () => {
  const presenceStats = useGlobalPresenceStore(useCallback((state) => state.presenceStats, []));
  const roomID = useRoomStore(useCallback((state) => state.currentRoomID, []));

  return <div className="padded:s-3 border whiteFill cursor:pointer">{roomID ? (presenceStats[roomID] || 0) : (presenceStats["home"] || 0)} watching</div>;
};
export default Footer;
