import { Unsubscribe } from "firebase/firestore";
import { useCallback, useEffect, useRef } from "react";
import { syncWebRing } from "../../lib/firestore";
import useRingStore from "../../stores/ringStore";
import Footer from "./footer";
import ClickGate from "./clickedGate";
import { logCallbackDestroyed, logCallbackSetup } from "../../lib/logger";

//TODO: Currently we have a listener for each ringNode. Can simplify, requires DB refactor.

const Layout: React.FunctionComponent<{ hideChat?: boolean; hideFooter?: boolean }> = ({
  children,
  hideFooter,
}) => {
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
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="fullBleed lightFill relative" key="layout">
      <ClickGate>
      {children}
      {!hideFooter && <Footer />}
      </ClickGate>
    </div>
  );
};

export default Layout;
