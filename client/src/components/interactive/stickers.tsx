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
  deleteStickerInstance,
  syncStickerInstances,
} from "../../lib/firestore";
import {
  logCallbackDestroyed,
  logCallbackSetup,
  logFirebaseUpdate,
  logInfo,
} from "../../lib/logger";
import { useRoomStore } from "../../stores/currentRoomStore";
import useStickerCDNStore from "../../stores/stickerStore";
import { DefaultStickerAdder, StickerAdderProps } from "./stickerAdders";
import { StickerRenderer } from "./stickerRenderHelpers";
import { useGlobalAdminStore } from "../../stores/globalUserAdminStore";

interface StickersProps {
  StickerChooser?: React.FC<StickerAdderProps>;
  style?: React.CSSProperties;
}
const Stickers: React.FC<StickersProps> = ({
  StickerChooser = DefaultStickerAdder,
}) => {
  const roomID = useRoomStore(useCallback((state) => state.currentRoomID, []));
  const stickerCDN = useStickerCDNStore(
    useCallback((state) => state.stickerCDN, []),
  );
  const adminForIDs = useGlobalAdminStore(useCallback((s) => s.adminFor, []));
  const autoClearEnabled = useRoomStore(useCallback((s) => s.roomInfo?.autoClearEnabled, []));
  const autoClearSeconds = useRoomStore(useCallback((s) => s.roomInfo?.autoClearSeconds, []));
  const [ref, bounds] = useMeasure({ scroll: true });

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
  };
  return roomID ? (
    <div
      className={"fullBleed absoluteOrigin videoAspectContainer stickerLayer"}
      id="sticker-overlay"
      ref={ref}
    >
      <div className="fullBleed">
        {stickerCDN && (
          <>
            <StickerChooser
              addSticker={addSticker}
              cdn={stickerCDN}
              containerBounds={bounds}
            />
            <ServerStickers
              roomID={roomID}
              key={`${roomID}-sssi`}
              cdn={stickerCDN}
              containerBounds={bounds}
              isAdmin={!!isAdmin}
              autoClearEnabled={!!autoClearEnabled}
              autoClearSeconds={autoClearSeconds}
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
  isAdmin: boolean;
  autoClearEnabled: boolean;
  autoClearSeconds?: number;
}> = ({ roomID, cdn, containerBounds, isAdmin, autoClearEnabled, autoClearSeconds }) => {
  const [serverSideStickerInstances, setServerSideStickerInstances] = useState<{
    [key: string]: StickerInstance;
  }>({});
  const unsub = useRef<Unsubscribe>();

  useEffect(() => {
    async function setupServerSync() {
      logCallbackSetup("StickerInstances");
      unsub.current = syncStickerInstances(roomID, setServerSideStickerInstances);
    }
    setupServerSync();
    return () => {
      logCallbackDestroyed("StickerInstances");
      unsub.current && unsub.current();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Admin cleanup interval: delete expired stickers from Firestore
  useEffect(() => {
    if (!isAdmin || !autoClearEnabled || !autoClearSeconds) return;
    const interval = setInterval(() => {
      const cutoff = Date.now() - autoClearSeconds * 1000;
      Object.entries(serverSideStickerInstances).forEach(([id, sticker]) => {
        if (sticker.timestamp && sticker.timestamp < cutoff) {
          deleteStickerInstance(roomID, id);
        }
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [isAdmin, autoClearEnabled, autoClearSeconds, roomID, serverSideStickerInstances]);

  const cutoff = autoClearEnabled && autoClearSeconds
    ? Date.now() - autoClearSeconds * 1000
    : null;

  return (
    <>
      {Object.entries(serverSideStickerInstances).map(([id, stickerInstance]) => {
        if (cutoff && stickerInstance.timestamp && stickerInstance.timestamp < cutoff) return null;
        return (
          cdn[stickerInstance.cdnID] && (
            <StickerRenderer
              key={`serverstickerinstance-${id}`}
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
