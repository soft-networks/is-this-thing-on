import { Unsubscribe } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { syncWebRing } from "../../lib/firestore";
import useRingStore, { roomIDToHREF } from "../../stores/ringStore";
import { useRoomStore } from "../../stores/roomStore";
import { NodeLink, SVGRingSeparate } from "./svg";
import { useRouter } from "next/router";

interface RingProps {
  collapsed?: boolean;
  noNav?: boolean;
}
const SmallRing: React.FC<RingProps> = ({ collapsed, noNav }) => {
  const ring = useRingStore(useCallback((s) => s.links, []));
  const roomID = useRoomStore(useCallback((s) => s.currentRoomID, []));

  return ring && roomID ? (
    <FooterLogo ring={ring} roomID={roomID} />
  ) : (
    <div> no links </div>
  );
};

const FooterLogo: React.FC<{ ring: WebRing; roomID: string }> = ({
  ring,
  roomID,
}) => {
  const { push } = useRouter();
  const indexSelected = useMemo(() => {
    if (!roomID) return;
    let i = Object.keys(ring).indexOf(roomID);
    return i > -1 ? i : undefined;
  }, [ring, roomID]);
  const navStream = useCallback(
    (n: number) => {
      let keys = Object.keys(ring);
      n = n < 0 ? keys.length - 1 : n;
      let nextKey = keys[n % keys.length];
      push(roomIDToHREF(nextKey));
    },
    [push, ring],
  );
  const ringParts = useMemo(
    () => SVGRingSeparate({ ring, currentlySelected: indexSelected }),
    [indexSelected, ring],
  );
  return (
    <div className="centerh relative">
      <div className="horizontal-stack:s-2">
        <div
          className="whiteFill clickable clickable:link border padded:s-3 contrastFill:hover"
          onClick={() =>
            indexSelected !== undefined && navStream(indexSelected - 1)
          }
        >
          prev
        </div>
        <NodeLink link={ring[roomID]} id={roomID} noNav />
        <div
          className="whiteFill clickable clickable:link border padded:s-3 contrastFill:hover"
          onClick={() =>
            indexSelected !== undefined && navStream(indexSelected + 1)
          }
        >
          next
        </div>
      </div>
    </div>
  );
};

export default SmallRing;
