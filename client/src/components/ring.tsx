import { Unsubscribe } from "firebase/firestore";
import { useCallback, useEffect, useRef } from "react";
import { syncWebRing } from "../lib/firestore";
import useRingStore from "../stores/ringStore";
import { useRoomStore } from "../stores/roomStore";
import { FooterLogo, HomeLogo } from "./logo";

interface RingProps {
  collapsed?: boolean;
}
const Ring: React.FC<RingProps> = ({ collapsed }) => {
  const ring = useRingStore(useCallback((s) => s.links, []));
  const updateStatus = useRingStore(useCallback((s) => s.updateStatus, []));
  const initializeRing = useRingStore(useCallback((s) => s.initializeRing, []));
  const unsubs = useRef<Unsubscribe[]>();
  const roomID = useRoomStore(useCallback((s) => s.currentRoomID, []));
  useEffect(() => {
    async function setupSync() {
      unsubs.current = await syncWebRing(initializeRing, updateStatus);
    }
    setupSync();
    return () => unsubs.current && unsubs.current.forEach((u) => u());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ring ? (
    collapsed ? (
      roomID ? (
        <FooterLogo ring={ring} roomID={roomID} />
      ) : null
    ) : (
      <HomeLogo ring={ring} />
    )
  ) : (
    <div> no links </div>
  );
};

export default Ring;
