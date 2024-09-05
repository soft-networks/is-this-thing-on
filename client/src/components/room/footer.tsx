import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import useRingStore from "../../stores/ringStore";
import { useRoomStore } from "../../stores/roomStore";
import AccountButton from "../account/accountButton";
import Ring from "../rings/smallRing";
import { syncTotalOnline } from "../../lib/firestore";
import classNames from "classnames";
import { useMediaQuery } from "react-responsive";

const Footer: React.FC = () => {
  const ring = useRingStore(useCallback((s) => s.links, []));
  const roomID = useRoomStore(useCallback((state) => state.currentRoomID, []));
  const isMobile = useMediaQuery({ maxWidth: 768 });
  return (
    <footer className={classNames("fullWidth uiLayer horizontal-stack", {"align-end:fixed": !isMobile, "relative": isMobile})}>
      {ring && roomID && ring[roomID] && (
        <div className={classNames("uiLayer padded:s-1 overflowVisible", {
          "centerh:absolute": !isMobile
        })}>
          <Ring collapsed />
        </div>
      )}
      <div
        className="uiLayer horizontal-stack:s-2 padded:s-1 align-end"
      >
        {roomID ? <NumOnlineRoom /> : <NumOnlineTotal />}
        <HomeButton />
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

const NumOnlineRoom: React.FC = () => {
  const numOnline = useRoomStore(useCallback((state) => state.roomInfo?.numOnline, []));
  return <div className="padded:s-3 border whiteFill">{numOnline} in room</div>;
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
  return <div className="padded:s-3 border whiteFill">{numOnline} on thing</div>;
};

export default Footer;
