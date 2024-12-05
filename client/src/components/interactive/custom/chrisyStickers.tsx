/* eslint-disable @next/next/no-img-element */

import classnames from "classnames";
import { Unsubscribe } from "firebase/firestore";
import useMeasure, { RectReadOnly } from "react-use-measure";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  addStickerInstance,
  syncStickerInstances,
} from "../../../lib/firestore";
import { useGlobalAdminStore } from "../../../stores/globalUserAdminStore";
import { useRoomStore } from "../../../stores/roomStore";
import useStickerCDNStore from "../../../stores/stickerStore";
import { useGlobalUserStore } from "../../../stores/globalUserStore";
import { DefaultStickerAdder, RandomStickerAdder } from "../stickerAdders";
import { StickerRenderer } from "../stickerRenderHelpers";

const ChrisyStickers: React.FC = () => {
  const roomID = useRoomStore(useCallback((state) => state.currentRoomID, []));

  const [ref, bounds] = useMeasure({ scroll: true });
  const stickerCDN = useStickerCDNStore(
    useCallback((state) => state.stickerCDN, []),
  );

  return roomID ? (
    <div
      className={"fullBleed absoluteOrigin relative stickerLayer"}
      id="sticker-overlay"
      ref={ref}
    >
      {stickerCDN && (
        <>
          <ChrisyStickerViewerController
            roomID={roomID}
            key={`${roomID}-ssi`}
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
  let [serverSideStickerInstances, setServerSideStickerInstances] = useState<{
    [key: string]: StickerInstance;
  }>({});
  const unsub = useRef<Unsubscribe>();
  const [behaviorOverride, setBehaviorOverride] = useState<BEHAVIOR_TYPES>();

  useEffect(() => {
    async function setupServerSync() {
      unsub.current = syncStickerInstances(roomID, setServerSideStickerInstances);
    }
    setupServerSync();
    return () => unsub.current && unsub.current();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {Object.entries(serverSideStickerInstances).map(([id, stickerInstance]) => {
        if (!cdn[stickerInstance.cdnID]) {
          console.log("No sticker", stickerInstance.cdnID);
        }
        return (
          cdn[stickerInstance.cdnID] && (
            <div
              className={classnames({
                stickerLayer: true,
                deleteCursor: behaviorOverride == "DELETE",
                moveCursor: behaviorOverride == "MOVE",
              })}
              key={`serversidestickerinstance-${id}`}
            >
              <StickerRenderer
                key={`serversidestickerinstance-sticker-${id}`}
                pos={stickerInstance.position}
                size={stickerInstance.size}
                sticker={cdn[stickerInstance.cdnID]}
                id={id}
                containerBounds={containerBounds}
                zIndex={100 + stickerInstance.zIndex}
              />
            </div>
          )
        );
      })}
      <ChrisyStickerAdder
        roomID={roomID}
        cdn={cdn}
        containerBounds={containerBounds}
      />
      <ChrisyStickerAdminController />
    </>
  );
};

const ChrisyStickerAdder: React.FC<{
  roomID: string;
  cdn: StickerCDN;
  containerBounds: RectReadOnly;
}> = ({ roomID, cdn, containerBounds }) => {
  const behaviorOverride = useGlobalAdminStore(
    useCallback((s) => s.stickerBehaviorOverride, []),
  );
  const displayName = useGlobalUserStore(
    useCallback((state) => state.displayName, []),
  );
  const addSticker = (pos: Pos, cdnID: string, scale?: number) => {
    if (!roomID) return;
    addStickerInstance(roomID, {
      position: pos,
      timestamp: Date.now(),
      cdnID: cdnID,
      size: cdn[cdnID].size,
      zIndex: 200,
    });
  };

  return behaviorOverride == undefined ? (
    <RandomStickerAdder
      addSticker={addSticker}
      cdn={cdn}
      containerBounds={containerBounds}
    />
  ) : null;
};

const ChrisyStickerAdminController: React.FC = () => {
  const behaviorOverride = useGlobalAdminStore(
    useCallback((s) => s.stickerBehaviorOverride, []),
  );
  const setBehaviorOverride = useGlobalAdminStore(
    useCallback((s) => s.setStickerBehaviorOverride, []),
  );

  return (
    <div
      style={
        {
          position: "fixed",
          top: "var(--s0)",
          width: "100%",
        } as React.CSSProperties
      }
      className="align:center highertThanStickerLayer horizontal-stack"
    >
      <div
        className={classnames(
          "uiLayer whiteFill padded:s-2 border-thin clickable ",
          {
            contrastFill: behaviorOverride == undefined,
            "contrastFill:hover": behaviorOverride !== undefined,
          },
        )}
        onClick={() => setBehaviorOverride(undefined)}
        key="NORMAL-CLICKER"
      >
        {"HIMS"} MODE
      </div>
      <div
        className={classnames(
          "uiLayer whiteFill padded:s-2 border-thin clickable ",
          {
            contrastFill: behaviorOverride == "MOVE",
            "contrastFill:hover": behaviorOverride !== "MOVE",
          },
        )}
        onClick={() => setBehaviorOverride("MOVE")}
        key="MOVE-CLICKER"
      >
        {"RUB"} MODE
      </div>
      <div
        className={classnames(
          "uiLayer whiteFill padded:s-2 border-thin clickable ",
          {
            contrastFill: behaviorOverride == "DELETE",
            "contrastFill:hover": behaviorOverride !== "DELETE",
          },
        )}
        onClick={() => setBehaviorOverride("DELETE")}
        key={"DELETE-CLICKER"}
      >
        {"BIC"} MODE
      </div>
    </div>
  );
};

export default ChrisyStickers;
