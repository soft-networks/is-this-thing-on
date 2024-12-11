import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { useRoomStore } from "../stores/currentRoomStore";
import AccountButton from "./account/accountButton";
import { FooterRing,HomeRing } from "./rings/smallRing";
import { syncTotalOnline } from "../lib/firestore";
import classNames from "classnames";
import useMediaQuery from "../stores/useMediaQuery";

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
        {pathname == "/" ? <NumOnlineTotal /> : <NumOnlineTotal />}
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
      <div className="padded:s-3 border clickable whiteFill contrastFill:hover" style={{ height: "28px", fontSize: "14px" }}>
      home
      </div>
    </Link>
  );
};

const NumOnlineRoom: React.FC = () => {
  const numOnline = useRoomStore(useCallback((state) => state.roomInfo?.numOnline, []));
  return <div className="padded:s-3 border whiteFill">{numOnline}</div>;
};

const NumOnlineTotal: React.FC = () => {
  const [numOnline, setNumOnline] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = syncTotalOnline((stats: number) => {
      setNumOnline(stats);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);
  return <div className="padded:s-3 border whiteFill">{numOnline}</div>;
};

export default Footer;
