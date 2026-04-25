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
import { useMuseumMode } from "../stores/useMuseumMode";
import { useGlobalAdminStore } from "../stores/globalUserAdminStore";
const Footer: React.FC = () => {
  const { pathname } = useRouter();
  const isMobile = useMediaQuery();
  const isProjectorMode = useMuseumMode(useCallback((state) => state.isProjectorMode, []));
  const isLivePage = pathname.startsWith("/live");

  if (!isLivePage) return null;

  return (
    <>
    <footer className={classNames("fullWidth uiLayer horizontal-stack", { "align-end:fixed": !isMobile, "relative": isMobile })}>
      <div className={classNames("uiLayer padded:s-2 overflowVisible", {
        "centerh:absolute": !isMobile
      })}>
         <FooterRing isHome={pathname == "/live"}/>
      </div>
      <div
        className="uiLayer horizontal-stack:s-2 padded:s-2 align-end"
      >
        {!isMobile && <AutoScanRing />}
        {!isProjectorMode && <AboutButton />}
        {!isProjectorMode && <HomeButton />}
      </div>
    </footer>
    <div className="uiLayer horizontal-stack:s-2 padded:s-2" style={{position: "fixed", top: "0", right: "0"}}>
      <AdminPanelReopenButton />
      <NumOnline />
      {!isProjectorMode && <AccountButton />}
    </div>
    </>
  );
};

const AboutButton: React.FC = () => {
  return (
    <a href="https://thing.tube/learnmore">
      <div className="padded:s-3 border clickable whiteFill greenFill:hover">
      about
      </div>
    </a>
  );
};

const HomeButton: React.FC = () => {
  const { pathname, back } = useRouter();
  return pathname == "/live" ? (
    <Link href={"/"} passHref>
      <div className="padded:s-3 border clickable whiteFill greenFill:hover">
      /
      </div>
    </Link>
  ) : (
    <Link href={"/live"} passHref>
      <div className="padded:s-3 border clickable whiteFill greenFill:hover">
      home
      </div>
    </Link>
  );
};

const AdminPanelReopenButton: React.FC = () => {
  const adminForIDs = useGlobalAdminStore(useCallback((s) => s.adminFor, []));
  const adminPanelOpen = useGlobalAdminStore(useCallback((s) => s.adminPanelOpen, []));
  const setAdminPanelOpen = useGlobalAdminStore(useCallback((s) => s.setAdminPanelOpen, []));
  if (adminForIDs.length === 0 || adminPanelOpen) return null;
  return (
    <div className="mars border-thin whiteFill padded:s-3 cursor:pointer greenFill:hover" onClick={() => setAdminPanelOpen(true)}>
      admin panel
    </div>
  );
};

const NumOnline: React.FC = () => {
  const presenceStats = useGlobalPresenceStore(useCallback((state) => state.presenceStats, []));
  const roomID = useRoomStore(useCallback((state) => state.currentRoomID, []));

  return <div className="padded:s-3 border whiteFill cursor:pointer">{roomID ? (presenceStats[roomID] || 0) : (presenceStats["home"] || 0)} watching</div>;
};
export default Footer;
