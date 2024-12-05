import { Unsubscribe } from "firebase/firestore";

import { useCallback, useEffect, useRef } from "react";

import { syncWebRing } from "../lib/firestore";
import { logCallbackDestroyed, logCallbackSetup } from "../lib/logger";
import useGlobalRoomsInfoStore from "../stores/globalRoomsInfoStore";
import ClickGate from "./gates/globalClickedGate";
import Footer from "./room/footer";
import useMediaQuery from "../stores/useMediaQuery";
import classnames from "classnames";
import Head from "next/head";
import Instrumentation from "./Instrumentation";


//TODO: Currently we have a listener for each ringNode. Can simplify, requires DB refactor.

const Layout: React.FunctionComponent<{
  hideChat?: boolean;
  hideFooter?: boolean;
  roomColor?: string;
}> = ({ children, hideFooter, roomColor }) => {
  const initializeRing = useGlobalRoomsInfoStore(useCallback((s) => s.initializeRing, []));
  const updateRingStatus = useGlobalRoomsInfoStore(useCallback((s) => s.updateRoomInfo, []));
  const ringUnsubs = useRef<Unsubscribe[]>();
  const isMobile = useMediaQuery();


  useEffect(() => {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);

    return () => window.removeEventListener('resize', setViewportHeight);
  }, [isMobile]);

  useEffect(() => {
    async function setupSync() {
      logCallbackSetup("RingSyncs");
      ringUnsubs.current = await syncWebRing(initializeRing, updateRingStatus);
    }
    setupSync();
    return () => {
      logCallbackDestroyed("RingSyncs");
      ringUnsubs.current && ringUnsubs.current.forEach((u) => u());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div
      className={classnames("fullScreen lightFill relative noOverflow", {"stack:noGap": isMobile})}
      key={`layout-${isMobile}`}
      style={
        roomColor ? ({ "--roomColor": roomColor } as React.CSSProperties) : {}
      }
    >
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <ClickGate>
        {children}
        {!hideFooter && <Footer />}
      </ClickGate>
      <Instrumentation />
    </div>
  );
};

export default Layout;
