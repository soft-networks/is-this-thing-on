/* eslint-disable @next/next/no-img-element */

import { Unsubscribe } from "firebase/firestore";
import React, { MouseEventHandler, useEffect, useRef, useState, useCallback } from "react";
import { addStickerInstance, getStickerCDN, syncStickerInstances } from "../lib/firestore";
import { useRoomStore } from "../stores/roomStore";
import useStickerCDNStore from "../stores/stickerStore";
import { useUserStore } from "../stores/userStore";

type StickerCDN = {[key:string]: Sticker};

interface StickersProps {
  StickerChooser?: React.FC<StickerAdderProps>
}
const Stickers: React.FC<StickersProps> = ({StickerChooser = DefaultStickerAdder}) => {
  const userID = useUserStore(useCallback((state) => state.currentUser?.uid, []));
  const roomID = useRoomStore(useCallback((state) => state.currentRoomID, []));
  const stickerCDN = useStickerCDNStore(useCallback(state => state.stickerCDN, []));
  // const [stickerCDN, setStickerCDN] = useState<{[key:string]: Sticker}>();
  
  // useEffect(() => {
  //   getStickerCDN(roomID, setStickerCDN);
  // },[roomID]); 

  const addSticker = (pos: Pos, cdnID: string) => {
    addStickerInstance(roomID, {
      position: pos,
      timestamp: Date.now(),
      cdnID: cdnID
    })
  };
  return roomID ? (
    <div className="fullBleed absoluteOrigin" >
      {userID && stickerCDN &&
        <>
          <StickerChooser addSticker={addSticker} cdn={stickerCDN} />
          <ServerStickers roomID={roomID} key={`${roomID}-sscoins`} cdn={stickerCDN}/>
        </>
        }
    </div>
  ) : null;
};

interface StickerAdderProps {
  addSticker: (pos: Pos, cdnID: string) => void,
  cdn: StickerCDN
}
const DefaultStickerAdder: React.FC<StickerAdderProps> = ({addSticker, cdn}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showStickerTypePicker, setShowStickerTypePicker] = useState<boolean>(false);
  const currentPosChosen = useRef<Pos>();
  const clicked: MouseEventHandler<HTMLDivElement> = (e) => {
    if (! showStickerTypePicker) {
    if (containerRef.current && cdn && Object.keys(cdn).length > 0) {
      let bounds = containerRef.current.getBoundingClientRect();
      let x = e.pageX / bounds.width;
      let y = e.pageY / bounds.height;
      currentPosChosen.current = [x, y];
      setShowStickerTypePicker(true);
    }
    }
  }
  const typeChosen = (id?: string) => {
    setShowStickerTypePicker(false);
    if (id) {
      if (currentPosChosen.current) {
        addSticker(currentPosChosen.current || [0,0], id);
      } else {
        console.log("Something bad happened");
      }
    }
  }
  return (
    <div className="fullBleed absoluteOrigin higher addCursor" onClick={clicked} ref={containerRef}>
      {showStickerTypePicker ? (
        <div
          className="absoluteOrigin "
          style={{ top: `${currentPosChosen.current ? currentPosChosen.current[1] * 100: 80}%`, left: `${currentPosChosen.current ? currentPosChosen.current[0] * 100 : 50}%` }}
        >
          <DefaultChooseStickerType cdn={cdn} typeSelected={typeChosen} />
        </div>
      ) : null}
    </div>
  );
}
const DefaultChooseStickerType: React.FC<{cdn: StickerCDN, typeSelected: (id?: string) => void}> = ({cdn, typeSelected}) => {
  return (
    <div className="horizontal-stack lightFill">
      <div className="clickable" onClick={(e) => typeSelected(undefined)}>cancel</div>
      {Object.keys(cdn).map((k) => (
        <div className="clickable" key={`choosesticker-${k}`} onClick={e => typeSelected(k)}> <StickerImage url={cdn[k].imageURL}/> </div>
      ))}
    </div>
  );
}


const ServerStickers: React.FC<{ roomID: string, cdn: StickerCDN }> = ({ roomID, cdn}) => {
  let [serverSideCoins, setServerSideCoins] = useState<{ [key: string]: StickerInstance }>({});
  const unsub = useRef<Unsubscribe>();

  const stickerAdded = useCallback(
    (cID, element) => {
      setServerSideCoins((pc) => {
        let npc = { ...pc };
        npc[cID] = element;
        return npc;
      });
    },
    [setServerSideCoins]
  );
  const stickerRemoved = useCallback(
    (cID) =>
      setServerSideCoins((pc) => {
        let npc = { ...pc };
        delete npc[cID];
        return npc;
      }),
    [setServerSideCoins]
  );
  useEffect(() => {
    async function setupServerSync() {
      unsub.current = syncStickerInstances(roomID,  stickerAdded, stickerRemoved);
    }
    setupServerSync();
    return () => unsub.current && unsub.current();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {Object.entries(serverSideCoins).map(([id, stickerInstance]) => (
        <StickerRenderer key={`servercoin-${id}`} pos={stickerInstance.position} url={cdn[stickerInstance.cdnID].imageURL} />
      ))}
    </>
  );
};

const StickerRenderer = ({ pos, url}: { pos: Pos, url: string}) => {

  return ( pos ? 
    <div style={{ left: `${pos[0] * 100}%`, top: `${pos[1] * 100}%`}} className={"absoluteOrigin"}>
      <StickerImage url={url}/> 
    </div> : <span></span>
  );
};

const StickerImage = ({ url }: { url: string }) => (
  <img src={url} alt={"Sticker"} style={{ width: "72px", height: "72px"}} />
);

export default Stickers;
