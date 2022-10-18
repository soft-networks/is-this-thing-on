import { Unsubscribe } from "firebase/firestore";
import { useCallback, useEffect, useRef } from "react";
import { syncWebRing } from "../lib/firestore";
import useRingStore from "../stores/ringStore";
import { useRoomStore } from "../stores/roomStore";
import { FooterLogo, HomeLogo } from "./logo";

interface RingProps {
  collapsed?: boolean;
  noNav?: boolean
}
const Ring: React.FC<RingProps> = ({ collapsed, noNav}) => {
  const ring = useRingStore(useCallback((s) => s.links, []));
  const roomID = useRoomStore(useCallback((s) => s.currentRoomID, []));
 
  return ring ? (
    collapsed ? (
      roomID ? (
        <FooterLogo ring={ring} roomID={roomID} />
      ) : null
    ) : (
      <HomeLogo ring={ring} noNav={noNav}/>
    )
  ) : (
    <div> no links </div>
  );
};

export default Ring;
