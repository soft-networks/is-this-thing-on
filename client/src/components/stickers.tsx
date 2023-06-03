/* eslint-disable @next/next/no-img-element */
import { Unsubscribe } from "firebase/firestore";
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import useMeasure, { RectReadOnly } from "react-use-measure";
import { addStickerInstance, performTransaction, resetStickers, syncStickerInstances } from "../lib/firestore";
import { useRoomStore } from "../stores/roomStore";
import useStickerCDNStore from "../stores/stickerStore";
import { useUserStore } from "../stores/userStore";
import { StickerAdderProps, DefaultStickerAdder } from "./stickerAdders";
import { StickerRenderer } from "./stickerRenderHelpers";
import Admin from "./admin";
import classnames from "classnames";

interface StickersProps {
  StickerChooser?: React.FC<StickerAdderProps>;
  style?: React.CSSProperties;
  className?: string;
}
const Stickers: React.FC<StickersProps> = ({ StickerChooser = DefaultStickerAdder, style, className }) => {
  const roomID = useRoomStore(useCallback((state) => state.currentRoomID, []));
  const stickerCDN = useStickerCDNStore(useCallback((state) => state.stickerCDN, []));
  const displayName = useUserStore(useCallback((state) => state.displayName, []));
  const [stickerStyle, setStickerStyle] = useState<React.CSSProperties>();
  const [ref, bounds] = useMeasure({ scroll: true });
  const currentRoomID = useRoomStore(useCallback((s) => s.currentRoomID, []));
  const adminForIDs = useUserStore(useCallback((s) => s.adminFor, []));
  const isAdmin = useMemo(() => {
    if (adminForIDs && currentRoomID && adminForIDs.includes(currentRoomID)) {
      console.log("is admin");
      return true;
    }
    console.log("NOT ADMIN", adminForIDs);
    return undefined;
  }, [adminForIDs, currentRoomID]);

  useEffect(() => {
    let currentStyle = {};
    if (style) {
      currentStyle = style;
    }
    switch (roomID) {
      case "chrisy": {
        let chrisStyle = {
          "--stickerSize": "10ch",
        } as React.CSSProperties;
        currentStyle = { ...chrisStyle, ...style };
      }
    }
    setStickerStyle(currentStyle);
  }, [roomID, style]);

  const addSticker = (pos: Pos, cdnID: string, scale?: number) => {
    if (!roomID) return;
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
    <div className={className || "fullBleed absoluteOrigin"} style={stickerStyle} id="sticker-overlay" ref={ref}>
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
  ) : null;
};

const ServerStickers: React.FC<{
  roomID: string;
  cdn: StickerCDN;
  containerBounds: RectReadOnly;
  isAdmin?: boolean;
  showControlsToUser?: boolean;
}> = ({ roomID, cdn, containerBounds, isAdmin, showControlsToUser }) => {
  let [serverSideCoins, setServerSideCoins] = useState<{ [key: string]: StickerInstance }>({});
  const unsub = useRef<Unsubscribe>();

  const [behaviorOverride, setBehaviorOverride] = useState<BEHAVIOR_TYPES>();

  const stickerUpdated = useCallback(
    (cID, pos, scale, z) => {
      setServerSideCoins((pc) => {
        let npc = { ...pc };
        if (npc[cID].position != pos) npc[cID].position = pos;
        if (npc[cID].size != scale) npc[cID].size = scale;
        if (npc[cID].zIndex != z) npc[cID].zIndex = z;
         console.log(JSON.stringify(npc[cID]), cID);
        //console.log(JSON.stringify(npc));
        return npc;
      });
    },
    [setServerSideCoins]
  );

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
      unsub.current = syncStickerInstances(roomID, stickerAdded, stickerRemoved, stickerUpdated);
    }
    setupServerSync();
    return () => unsub.current && unsub.current();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateBehavior = useCallback((behavior: BEHAVIOR_TYPES | undefined) => {
    if (behavior == "RESET") {
      resetStickers(roomID);
      return;
    }
    setBehaviorOverride(behavior);
  },[roomID])

  return (
    <>
      {Object.entries(serverSideCoins).map(([id, stickerInstance]) => {
        if (!cdn[stickerInstance.cdnID]) {
          console.log("No sticker", stickerInstance.cdnID);
        }
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
      {isAdmin && <AdminPanel setBehaviorOverride={updateBehavior} behaviorOverride={behaviorOverride}/>}
    </>
  );
};

const AdminPanel: React.FC<{
  setBehaviorOverride: (behavior: BEHAVIOR_TYPES | undefined) => void;
  behaviorOverride: BEHAVIOR_TYPES | undefined;
}> = ({ setBehaviorOverride, behaviorOverride }) => {
  return (
    <div style={{ position: "fixed", top: "var(--s0)", width: "100%" }} className="align:center ">
      <div className="stack:s-2 faintWhiteFill padded:s-2 relative border-radius everest ">
        <div
          className="caption absoluteOrigin noEvents center-text lightFill"
          style={{ left: "calc(-1 *var(--s-2))", top: "calc(-1 * var(--s-2)" }}
        >
          admin panel
        </div>
        <div className="horizontal-stack">
          <div
            className={classnames("clickable contrastFill:hover", { blue: behaviorOverride == "NORMAL" })}
            onClick={() => setBehaviorOverride("MOVE")}
          >
            {"MOVE"} MODE
          </div>
          <div
            className={classnames("clickable contrastFill:hover", { blue: behaviorOverride == "DELETE" })}
            onClick={() => setBehaviorOverride("DELETE")}
          >
            {"DELETE"} MODE
          </div>
          <div
            className={classnames("clickable contrastFill:hover", { blue: behaviorOverride == undefined })}
            onClick={() => setBehaviorOverride(undefined)}
          >
            {"USER"} MODE
          </div>

          <div
            className={classnames("clickable contrastFill:hover")}
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
