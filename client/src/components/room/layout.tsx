import { Unsubscribe } from "firebase/firestore";

import { useCallback, useEffect, useRef } from "react";

import { syncWebRing } from "../../lib/firestore";
import { logCallbackDestroyed, logCallbackSetup } from "../../lib/logger";
import useRingStore from "../../stores/ringStore";
import ClickGate from "./clickedGate";
import Footer from "./footer";
import { useMediaQuery } from "react-responsive";

//TODO: Currently we have a listener for each ringNode. Can simplify, requires DB refactor.

const Layout: React.FunctionComponent<{
  hideChat?: boolean;
  hideFooter?: boolean;
  roomColor?: string;
}> = ({ children, hideFooter, roomColor }) => {
  const initializeRing = useRingStore(useCallback((s) => s.initializeRing, []));
  const updateRingStatus = useRingStore(useCallback((s) => s.updateStatus, []));
  const ringUnsubs = useRef<Unsubscribe[]>();

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
      className="fullBleed crazyFill relative"
      key="layout"
      style={
        roomColor ? ({ "--roomColor": roomColor } as React.CSSProperties) : {}
      }
    >
      <ClickGate>
        {children}
        {!hideFooter && <Footer />}
      </ClickGate>
    </div>
  );
};

export default Layout;
