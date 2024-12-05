import { useEffect } from "react";
import ClickGate from "./gates/globalClickedGate";
import Footer from "./footer";
import useMediaQuery from "../stores/useMediaQuery";
import classnames from "classnames";
import Head from "next/head";
import Instrumentation from "./Instrumentation";
import  GlobalRoomsSummaryProvider  from "./gates/globalRoomsSummaryProvider";
import GlobalPresenceGate from "./gates/globalPresenceGate";


//TODO: Currently we have a listener for each ringNode. Can simplify, requires DB refactor.

const Layout: React.FunctionComponent<{
  hideChat?: boolean;
  hideFooter?: boolean;
  roomColor?: string;
}> = ({ children, hideFooter, roomColor }) => {
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
        <GlobalRoomsSummaryProvider>
          <GlobalPresenceGate>
            {children}
            {!hideFooter && <Footer />}
          </GlobalPresenceGate>
        </GlobalRoomsSummaryProvider>
      </ClickGate>
      <Instrumentation />
    </div>
  );
};

export default Layout;