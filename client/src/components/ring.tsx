
import { Unsubscribe } from "firebase/firestore";
import { useCallback, useEffect, useRef } from "react";
import { syncWebRing } from "../lib/firestore";
import useRingStore from "../stores/ringStore";
import Logo from "./logo";


interface RingProps {
  collapsed?: boolean
}
const Ring: React.FC<RingProps> = ({collapsed}) => {
  const links = useRingStore(useCallback(s => s.links, []));;
  const updateStatus = useRingStore(useCallback(s => s.updateStatus, []));
  const initializeRing = useRingStore(useCallback(s => s.initializeRing, []));
  const unsubs = useRef<Unsubscribe[]>();
  useEffect(() => {
    async function setupSync() {
      unsubs.current = await syncWebRing(initializeRing, updateStatus);  
    }
    setupSync();
    return () => unsubs.current && unsubs.current.forEach((u)=> u());
  }, [initializeRing, updateStatus]); 
  return links ? <Logo ring={links} collapsed={collapsed}/> : <div> no links </div>
};


export default Ring;