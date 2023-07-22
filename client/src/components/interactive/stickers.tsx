/* eslint-disable @next/next/no-img-element */
import { Unsubscribe } from "firebase/firestore";
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import useMeasure, { RectReadOnly } from "react-use-measure";
import { addStickerInstance, performTransaction, resetStickers, syncStickerInstances } from "../../lib/firestore";
import { useRoomStore } from "../../stores/roomStore";
import useStickerCDNStore from "../../stores/stickerStore";
import { useUserStore } from "../../stores/userStore";
import { StickerAdderProps, DefaultStickerAdder } from "./stickerAdders";
import { StickerRenderer } from "./stickerRenderHelpers";
import { logCallbackDestroyed, logCallbackSetup, logFirebaseUpdate, logInfo } from "../../lib/logger";

interface StickersProps {
  StickerChooser?: React.FC<StickerAdderProps>;
  style?: React.CSSProperties;
  className?: string;
}
const Stickers: React.FC<StickersProps> = ({ StickerChooser = DefaultStickerAdder, className }) => {
  

  //Stores
  const roomID = useRoomStore(useCallback((state) => state.currentRoomID, []));
  const stickerCDN = useStickerCDNStore(useCallback((state) => state.stickerCDN, []));
  const adminForIDs = useUserStore(useCallback((s) => s.adminFor, []));
  const displayName = useUserStore(useCallback((state) => state.displayName, []));

  //Local
  const [stickerStyle, setStickerStyle] = useState<React.CSSProperties>();
  const [ref, bounds] = useMeasure({ scroll: true });

  //TOOD: Abstract this into the user store. Can do in room.tsx or artist room (whever you put the cdn).
  const isAdmin = useMemo(() => {
    if (adminForIDs && roomID && adminForIDs.includes(roomID)) {
      logFirebaseUpdate("You are Admin for this room");
      return true;
    }
    return undefined;
  }, [adminForIDs, roomID]);

  const addSticker = (pos: Pos, cdnID: string, scale?: number) => {
    if (!roomID) return;
    logInfo("Adding sticker and performing transaction");
    addStickerInstance(roomID, {
      position: pos,
      timestamp: Date.now(),
      cdnID: cdnID,
      size: scale,
      zIndex: 200,
    });
    performTransaction({
      amount: 1,
      from: displayName || "unknown",
      to: roomID,
      timestamp: Date.now(),
    });
  };
  return roomID ? (
    <div
      className={className || "fullBleed absoluteOrigin center:children"}
      style={stickerStyle}
      id="sticker-overlay"
      ref={ref}
    >
      <div className="videoAspect videoWidthHeight relative">
        {stickerCDN && (
          <>
            <StickerChooser addSticker={addSticker} cdn={stickerCDN} containerBounds={bounds} />
            <ServerStickers
              roomID={roomID}
              key={`${roomID}-sscoins`}
              cdn={stickerCDN}
              containerBounds={bounds}
            />
          </>
        )}
      </div>
    </div>
  ) : null;
};

const ServerStickers: React.FC<{
  roomID: string;
  cdn: StickerCDN;
  containerBounds: RectReadOnly;
}> = ({ roomID, cdn, containerBounds }) => {
  let [serverSideCoins, setServerSideCoins] = useState<{ [key: string]: StickerInstance }>({});
  const unsub = useRef<Unsubscribe>();
  const stickerUpdated = useCallback(
    (cID, pos, scale, z) => {
      logFirebaseUpdate("StickerInstance updated");
      setServerSideCoins((pc) => {
        let npc = { ...pc };
        if (npc[cID].position != pos) npc[cID].position = pos;
        if (npc[cID].size != scale) npc[cID].size = scale;
        if (npc[cID].zIndex != z) npc[cID].zIndex = z;
        return npc;
      });
    },
    [setServerSideCoins]
  );

  const stickerAdded = useCallback(
    (cID, element) => {
      logFirebaseUpdate("StickerInstance Added");
      setServerSideCoins((pc) => {
        let npc = { ...pc };
        npc[cID] = element;
        return npc;
      });
    },
    [setServerSideCoins]
  );
  const stickerRemoved = useCallback(
    (cID) => {
      logFirebaseUpdate("StickerInstance removed");
      setServerSideCoins((pc) => {
        let npc = { ...pc };
        delete npc[cID];
        return npc;
      });
    },
    [setServerSideCoins]
  );
  useEffect(() => {
    async function setupServerSync() {
      logCallbackSetup("StickerInstances");
      unsub.current = syncStickerInstances(roomID, stickerAdded, stickerRemoved, stickerUpdated);
    }
    setupServerSync();
    return () => {
      logCallbackDestroyed("StickerInstances")
      unsub.current && unsub.current();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  //TODO URGENT: BEST PRACTICES FOR RENDERING A DICTIONARY LIKE THIS (don't re-render everything??)
  return (
    <>
      {Object.entries(serverSideCoins).map(([id, stickerInstance]) => {
        return (
          cdn[stickerInstance.cdnID] && (
            <StickerRenderer
              key={`servercoin-${id}`}
              pos={stickerInstance.position}
              size={stickerInstance.size}
              sticker={cdn[stickerInstance.cdnID]}
              id={id}
              containerBounds={containerBounds}
              zIndex={100 + stickerInstance.zIndex}
            />
          )
        );
      })}
    </>
  );
};

export default Stickers;
