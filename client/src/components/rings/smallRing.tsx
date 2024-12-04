import { useRouter } from "next/router";
import { useCallback, useMemo, } from "react";
import useRingStore, { roomIDToHREF } from "../../stores/ringStore";
import { useRoomStore } from "../../stores/roomStore";
import { NodeLink, SVGRingSeparate } from "./svg";

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
    <></>
  );
};

export const HomeRing: React.FC<{ }> = ({}) => {
  const ring = useRingStore(useCallback((s) => s.links, []));
  const { push } = useRouter();

  return <div className="centerh relative">
  <div className="horizontal-stack:s-2">
    <div
      className="whiteFill clickable clickable:link border padded:s-3 contrastFill:hover"
      onClick={() => {
        const keys = Object.keys(ring);
        if (keys.length > 0) {
          const firstRoomID = keys[keys.length-1];
          push(roomIDToHREF(firstRoomID));
        }
      }}
    >
      ←
    </div>
    <div
      className={`border padded:s-3 center-text`}
      style={{backgroundColor:  "var(--contrast)"}}
    >
      <span>home</span>
    </div>    <div
      className="whiteFill clickable clickable:link border padded:s-3 contrastFill:hover"
      onClick={() => {
        const keys = Object.keys(ring);
        if (keys.length > 0) {
          const firstRoomID = keys[0];
          push(roomIDToHREF(firstRoomID));
        }
      }}
    >
      →
    </div>
  </div>
</div>
};

const FooterLogo: React.FC<{ roomID: string }> = ({
  roomID,
}) => {
  const ring = useRingStore(useCallback((s) => s.links, []));
  const { push } = useRouter();
  const indexSelected = useMemo(() => {
    if (!roomID) return;
    let i = Object.keys(ring).indexOf(roomID);
    return i > -1 ? i : undefined;
  }, [ring, roomID]);
  const navStream = useCallback(
    (n: number) => {
      let keys = Object.keys(ring);
      if (n == keys.length || n == -1) {
        push("/");
      } else {
        n = n < 0 ? keys.length - 1 : n;
        let nextKey = keys[n % keys.length];
        push(roomIDToHREF(nextKey));
      }
    },
    [push, ring],
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
          ←
        </div>
        <NodeLink link={ring[roomID]} id={roomID} noNav />
        <div
          className="whiteFill clickable clickable:link border padded:s-3 contrastFill:hover"
          onClick={() =>
            indexSelected !== undefined && navStream(indexSelected + 1)
          }
        >
          →
        </div>
      </div>
    </div>
  );
};

export default SmallRing;
