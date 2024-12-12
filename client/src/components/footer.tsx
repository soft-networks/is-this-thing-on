import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { useRoomStore } from "../stores/currentRoomStore";
import AccountButton from "./account/accountButton";
import { FooterRing } from "./rings/smallRing";
import { syncTotalOnline } from "../lib/firestore";
import classNames from "classnames";
import useMediaQuery from "../stores/useMediaQuery";
import useGlobalPresenceStore from "../stores/globalPresenceStore";

const Footer: React.FC = () => {
  const { pathname } = useRouter();
  const isMobile = useMediaQuery();
  return (
    <footer className={classNames("fullWidth uiLayer horizontal-stack", { "align-end:fixed": !isMobile, "relative": isMobile })}>
      <div className={classNames("uiLayer padded:s-1 overflowVisible", {
        "centerh:absolute": !isMobile
      })}>
         <FooterRing isHome={pathname == "/"}/>
      </div>
      <div
        className="uiLayer horizontal-stack:s-2 padded:s-1 align-end"
      >
        <HomeButton />
        <NumOnline />
        <AccountButton />
      </div>
    </footer>
  );
};

const HomeButton: React.FC = () => {
  const { pathname, back } = useRouter();
  return pathname == "/" ? (
    <Link href={"/about"} passHref>
      <div className="padded:s-3 border clickable whiteFill contrastFill:hover">
      about
      </div>
    </Link>
  ) : (
    <Link href={"/"} passHref>
      <div className="padded:s-3 border clickable whiteFill contrastFill:hover">
      home
      </div>
    </Link>
  );
};

const NumOnline: React.FC = () => {
  const presenceStats = useGlobalPresenceStore(useCallback((state) => state.presenceStats, []));
  const roomID = useRoomStore(useCallback((state) => state.currentRoomID, []));


  return <div className="padded:s-3 border whiteFill">{roomID ? (presenceStats[roomID] || 0) : (presenceStats["home"] || 0)}</div>;
};
export default Footer;
