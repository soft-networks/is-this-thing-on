import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";

import useRingStore from "../../stores/ringStore";
import { useRoomStore } from "../../stores/roomStore";
import AccountButton from "../account/accountButton";
import Ring from "../rings/smallRing";

const Footer: React.FC = () => {
  const ring = useRingStore(useCallback((s) => s.links, []));
  const roomID = useRoomStore(useCallback((state) => state.currentRoomID, []));
  return (
    <footer className="align-end:fixed fullWidth uiLayer">
      {ring && roomID && ring[roomID] && (
        <div className="uiLayer padded:s-1 centerh:absolute align-end:absolute  overflowVisible showOnHoverSelfTrigger ">
          <Ring collapsed />
        </div>
      )}
      <div
        className="uiLayer horizontal-stack:s-2 padded:s-1 "
        style={{ position: "absolute", bottom: 0, right: 0 }}
      >
        <NumOnline />
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
      <div className="padded:s-3 border clickable whiteFill contrastFill:hover showOnHoverSelfTrigger">
        home
      </div>
    </Link>
  );
};

const NumOnline: React.FC = () => {
  const numOnline = useRoomStore(useCallback((state) => state.roomInfo?.numOnline, []));
  return <div className="padded:s-3 border whiteFill">{numOnline} in room</div>;
};

export default Footer;
