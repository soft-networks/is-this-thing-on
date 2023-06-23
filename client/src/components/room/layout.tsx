import { Unsubscribe } from "firebase/firestore";
import { useCallback, useEffect, useRef } from "react";
import { Chat } from "../interactive/chat";
import { syncWebRing } from "../../lib/firestore";
import useRingStore from "../../stores/ringStore";
import Footer from "./footer";
import useDidClick from "../../stores/clickedStore";

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
      <ClickGate>
      <main className="fullBleed" key="container">
        {children}
      </main>
      {!hideFooter && <Footer />}
      </ClickGate>
    </div>
  );
};

const ClickGate: React.FunctionComponent = ({ children }) => {
  const didClick = useDidClick(useCallback((s) => s.didClick, []));
  const setDidClick = useDidClick(useCallback((s) => s.setDidClick, []));
  
  const clickHappened = useCallback(() => { setDidClick(true); }, [setDidClick]);
  useEffect(() => {
    //Set event listener on window
    window.addEventListener("click", clickHappened);
  }, [clickHappened]);

  return didClick ? (
    <>{children}</>
  ) : (
    <div className="fullBleed contrastFill relative">
      <div className="h1 center:absolute highest center-text">WELCOME TO THING. <br/> CLICK 2 ENTER</div>
    </div>
  );
}
export default Layout;
