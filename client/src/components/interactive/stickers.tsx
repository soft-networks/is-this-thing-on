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
import classnames from "classnames";
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
            <StickerChooser addSticker={addSticker} cdn={stickerCDN} containerBounds={bounds} isAdmin={isAdmin} />
            <ServerStickers
              roomID={roomID}
              key={`${roomID}-sscoins`}
              cdn={stickerCDN}
              containerBounds={bounds}
              isAdmin={isAdmin}
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
  isAdmin?: boolean;
}> = ({ roomID, cdn, containerBounds, isAdmin }) => {
  let [serverSideCoins, setServerSideCoins] = useState<{ [key: string]: StickerInstance }>({});
  const [behaviorOverride, setBehaviorOverride] = useState<BEHAVIOR_TYPES>();
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

  const updateBehavior = useCallback(
    (behavior: BEHAVIOR_TYPES | undefined) => {
      if (behavior == "RESET") {
        logFirebaseUpdate("About to remove stickers completely");
        resetStickers(roomID);
        return;
      }
      setBehaviorOverride(behavior);
    },
    [roomID]
  );

  //TODO URGENT: BEST PRACTICES FOR RENDERING A DICTIONARY LIKE THIS (don't re-render everything??)
  return (
    <>
      {isAdmin && <AdminPanel setBehaviorOverride={updateBehavior} behaviorOverride={behaviorOverride} />}
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
              adminOverride={behaviorOverride}
              zIndex={100 + stickerInstance.zIndex}
            />
          )
        );
      })}
    </>
  );
};

const AdminPanel: React.FC<{
  setBehaviorOverride: (behavior: BEHAVIOR_TYPES | undefined) => void;
  behaviorOverride: BEHAVIOR_TYPES | undefined;
}> = ({ setBehaviorOverride, behaviorOverride }) => {
  return (
    <div style={{ position: "fixed", top: "var(--s0)", width: "100%" }} className="align:center ">
      <div className="stack:s-2 faintWhiteFill padded:s-2 relative border-radius higherThanStickerLayer ">
        <div
          className="caption absoluteOrigin noEvents center-text lightFill"
          style={{ left: "calc(-1 *var(--s-2))", top: "calc(-1 * var(--s-2)" }}
        >
          admin panel
        </div>
        <div className="horizontal-stack higherThanStickerLayer">
          <div
            className={classnames("higherThanStickerLayer clickable contrastFill:hover", { blue: behaviorOverride == "MOVE" })}
            onClick={() => setBehaviorOverride("MOVE")}
          >
            {"MOVE"} MODE
          </div>
          <div
            className={classnames("higherThanStickerLayer clickable contrastFill:hover", { blue: behaviorOverride == "DELETE" })}
            onClick={() => setBehaviorOverride("DELETE")}
          >
            {"DELETE"} MODE
          </div>
          <div
            className={classnames("higherThanStickerLayer clickable contrastFill:hover", { blue: behaviorOverride == undefined })}
            onClick={() => setBehaviorOverride(undefined)}
          >
            {"USER"} MODE
          </div>

          <div
            className={classnames("higherThanStickerLayer clickable contrastFill:hover")}
            onClick={() => setBehaviorOverride("RESET")}
          >
            RESET STICKERS
          </div>
        </div>
      </div>
    </div>
  );
};
export default Stickers;
