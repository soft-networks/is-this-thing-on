import { useCallback, useEffect } from "react";
import ClickGate from "./gates/globalClickedGate";
import Footer from "./footer";
import useMediaQuery from "../stores/useMediaQuery";
import classnames from "classnames";
import Head from "next/head";
import Instrumentation from "./Instrumentation";
import GlobalRoomsSummaryProvider from "./gates/globalRoomsSummaryProvider";
import GlobalPresenceGate from "./gates/globalPresenceGate";
import GlobalUserAdminProvider from "./gates/globalUserAdminStore";
import { useMuseumMode } from '../stores/useMuseumMode';
import MuseumFooter from './MuseumFooter';


//TODO: Currently we have a listener for each ringNode. Can simplify, requires DB refactor.

const Layout: React.FunctionComponent<{
  hideChat?: boolean;
}> = ({ children }) => {
  const isMobile = useMediaQuery();
  const isMusuemMode = useMuseumMode(useCallback(s => s.isMuseumMode, []));

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
    <ClickGate>
      <div
        className={classnames("fullScreen lightFill relative noOverflow", { "redFill": isMusuemMode })}
        key={`layout-${isMobile}-${isMusuemMode}`}
      >
        <div className={classnames({
          "fullScreen relative": !isMusuemMode,
          "stack:noGap": isMobile || isMusuemMode,
          "fourByThree lightFill": isMusuemMode
        })}>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          </Head>
          <GlobalRoomsSummaryProvider>
            <GlobalUserAdminProvider>
              <GlobalPresenceGate>
                {isMusuemMode ? <div className="sixteenByNine">{children}</div> : children}
                {isMusuemMode ? <MuseumFooter /> : <Footer />}
              </GlobalPresenceGate>
            </GlobalUserAdminProvider>
          </GlobalRoomsSummaryProvider>
          <Instrumentation />
        </div>
      </div>
    </ClickGate>
  );
};

export default Layout;
