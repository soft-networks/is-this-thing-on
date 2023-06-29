/* eslint-disable @next/next/no-img-element */

import { Unsubscribe } from "firebase/firestore";
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import useMeasure, { RectReadOnly } from "react-use-measure";
import { addStickerInstance, performTransaction, syncStickerInstances } from "../../../lib/firestore";
import { useRoomStore } from "../../../stores/roomStore";
import useStickerCDNStore from "../../../stores/stickerStore";
import { useUserStore } from "../../../stores/userStore";
import {  DefaultStickerAdder, RandomStickerAdder } from "../stickerAdders";
import { StickerRenderer } from "../stickerRenderHelpers";
import classnames from "classnames";

const ChrisyStickers: React.FC = () => {
  const roomID = useRoomStore(useCallback((state) => state.currentRoomID, []));
  
  const [ref, bounds] = useMeasure({ scroll: true });
  const currentRoomID = useRoomStore(useCallback((s) => s.currentRoomID, []));
  const adminForIDs = useUserStore(useCallback((s) => s.adminFor, []));
  const stickerCDN = useStickerCDNStore(useCallback((state) => state.stickerCDN, []));
  const isAdmin = useMemo(() => {
    if (adminForIDs && currentRoomID && adminForIDs.includes(currentRoomID)) return true;
    else return undefined;
  }, [adminForIDs, currentRoomID]);

  return roomID ? (
    <div className={"fullBleed absoluteOrigin relative stickerLayer"} id="sticker-overlay" ref={ref}>
      {stickerCDN && (
        <>
          <ChrisyStickerViewerController
            roomID={roomID}
            key={`${roomID}-sscoins`}
            cdn={stickerCDN}
            containerBounds={bounds}
          />
        </>
      )}
    </div>
  ) : null;
};

const ChrisyStickerViewerController: React.FC<{
  roomID: string;
  cdn: StickerCDN;
  containerBounds: RectReadOnly;
}> = ({ roomID, cdn, containerBounds }) => {
  let [serverSideCoins, setServerSideCoins] = useState<{ [key: string]: StickerInstance }>({});
  const unsub = useRef<Unsubscribe>();
  const displayName = useUserStore(useCallback((state) => state.displayName, []));
  const [behaviorOverride, setBehaviorOverride] = useState<BEHAVIOR_TYPES>();

  const stickerUpdated = useCallback(
    (cID, pos, scale, z) => {
      setServerSideCoins((pc) => {
        let npc = { ...pc };
        if (npc[cID].position != pos) npc[cID].position = pos;
        if (npc[cID].size != scale) npc[cID].size = scale;
        if (npc[cID].zIndex != z) npc[cID].zIndex = z;
        //console.log(JSON.stringify(npc));
        return npc;
      });
    },
    [setServerSideCoins]
  );
  const addSticker = (pos: Pos, cdnID: string, scale?: number) => {
    if (!roomID) return;
    let localScale = 0.3;
    if (cdnID == "hair1") {
      localScale = 0.27;
    }
    if (cdnID == "hair2") {
      localScale = 0.33;
    }
    if (cdnID == "hair3") {
      localScale = 0.24;
    }
    if (cdnID == "hair4") {
      localScale = 0.57;
    }
    addStickerInstance(roomID, {
      position: pos,
      timestamp: Date.now(),
      cdnID: cdnID,
      size: localScale,
      zIndex: 200,
    });
    performTransaction({
      amount: 1,
      from: displayName || "unknown",
      to: roomID,
      timestamp: Date.now(),
    });
  };

  useEffect(()=> {

  }, [])

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

  return (
    <>
      {Object.entries(serverSideCoins).map(([id, stickerInstance]) => {
        if (!cdn[stickerInstance.cdnID]) {
          console.log("No sticker", stickerInstance.cdnID);
        }
        return (
          cdn[stickerInstance.cdnID] && (
            <div
              className={classnames({
                deleteCursor: behaviorOverride == "DELETE",
                moveCursor: behaviorOverride == "MOVE",
              })}
            >
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
            </div>
          )
        );
      })}
      {behaviorOverride == "NORMAL" && (
        <RandomStickerAdder addSticker={addSticker} cdn={cdn} containerBounds={containerBounds} />
      )}
      <div style={{ position: "fixed", top: "var(--s0)", width: "100%"} as React.CSSProperties} className="align:center">
        <div className="horizontal-stack ">
          <div
            className={classnames("higherThanStickerLayer clickable contrastFill:hover", { blue: behaviorOverride == "NORMAL" })}
            onClick={() => setBehaviorOverride("NORMAL")}
          >
            {"HIMS"} MODE
          </div>
          <div
            className={classnames("higherThanStickerLayer clickable contrastFill:hover", { blue: behaviorOverride == "MOVE" })}
            onClick={() => setBehaviorOverride("MOVE")}
          >
            {"RUB"} MODE
          </div>
          <div
            className={classnames("higherThanStickerLayer clickable contrastFill:hover", { blue: behaviorOverride == "DELETE" })}
            onClick={() => setBehaviorOverride("DELETE")}
          >
            {"BIC"} MODE
          </div>
        </div>
      </div>
    </>
  );
};


export default ChrisyStickers;
