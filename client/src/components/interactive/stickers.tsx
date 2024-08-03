/* eslint-disable @next/next/no-img-element */
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
  performTransaction,
  resetStickers,
  syncStickerInstances,
} from "../../lib/firestore";
import {
  logCallbackDestroyed,
  logCallbackSetup,
  logFirebaseUpdate,
  logInfo,
} from "../../lib/logger";
import { useRoomStore } from "../../stores/roomStore";
import useStickerCDNStore from "../../stores/stickerStore";
import { useUserStore } from "../../stores/userStore";
import { DefaultStickerAdder, StickerAdderProps } from "./stickerAdders";
import { StickerRenderer } from "./stickerRenderHelpers";

interface StickersProps {
  StickerChooser?: React.FC<StickerAdderProps>;
  style?: React.CSSProperties;
}
const Stickers: React.FC<StickersProps> = ({
  StickerChooser = DefaultStickerAdder,
}) => {
  //Stores
  const roomID = useRoomStore(useCallback((state) => state.currentRoomID, []));
  const stickerCDN = useStickerCDNStore(
    useCallback((state) => state.stickerCDN, []),
  );
  const adminForIDs = useUserStore(useCallback((s) => s.adminFor, []));
  const displayName = useUserStore(
    useCallback((state) => state.displayName, []),
  );

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

  const addSticker = (
    pos: Pos,
    cdnID: string,
    scale?: number,
    text?: string,
  ) => {
    if (!roomID) return;
    logInfo("Adding sticker and performing transaction");
    addStickerInstance(roomID, {
      position: pos,
      timestamp: Date.now(),
      cdnID: cdnID,
      size: scale,
      zIndex: 200,
      text: text,
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
      className={"fullBleed absoluteOrigin videoAspectContainer"}
      style={stickerStyle}
      id="sticker-overlay"
      ref={ref}
    >
      <div className="videoAspectElement">
        {stickerCDN && (
          <>
            <StickerChooser
              addSticker={addSticker}
              cdn={stickerCDN}
              containerBounds={bounds}
            />
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
  let [serverSideCoins, setServerSideCoins] = useState<{
    [key: string]: StickerInstance;
  }>({});
  const unsub = useRef<Unsubscribe>();

  useEffect(() => {
    async function setupServerSync() {
      logCallbackSetup("StickerInstances");
      unsub.current = syncStickerInstances(roomID, setServerSideCoins);
    }
    setupServerSync();
    return () => {
      logCallbackDestroyed("StickerInstances");
      unsub.current && unsub.current();
    };
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
