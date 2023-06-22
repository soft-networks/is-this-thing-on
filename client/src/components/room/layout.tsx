import { Unsubscribe } from "firebase/firestore";
import { useCallback, useEffect, useRef } from "react";
import { Chat } from "../interactive/chat";
import { syncWebRing } from "../../lib/firestore";
import useRingStore from "../../stores/ringStore";
import Footer from "./footer";

const Layout: React.FunctionComponent<{ hideChat?: boolean; hideFooter?: boolean }> = ({
  children,
  hideChat,
  hideFooter,
}) => {
  const initializeRing = useRingStore(useCallback((s) => s.initializeRing, []));
  const updateRingStatus = useRingStore(useCallback((s) => s.updateStatus, []));
  const ringUnsubs = useRef<Unsubscribe[]>();
  useEffect(() => {
    async function setupSync() {
      ringUnsubs.current = await syncWebRing(initializeRing, updateRingStatus);
    }
    setupSync();
    return () => ringUnsubs.current && ringUnsubs.current.forEach((u) => u());
  }, [initializeRing, updateRingStatus]);

  return (
    <div className="fullBleed lightFill relative" key="layout">
      <main className="fullBleed" key="container">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
