/* eslint-disable @next/next/no-img-element */

import classnames from "classnames";
import { Unsubscribe } from "firebase/firestore";
import React, {
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
  useCallback,
  createRef,
  RefObject,
  useMemo,
} from "react";
import Draggable, { DraggableEventHandler } from "react-draggable";
import useMeasure, { RectReadOnly } from "react-use-measure";
import {
  addStickerInstance,
  deleteStickerInstance,
  getStickerCDN,
  performTransaction,
  syncStickerInstances,
  updateStickerInstancePos,
} from "../lib/firestore";
import { useRoomStore } from "../stores/roomStore";
import useStickerCDNStore from "../stores/stickerStore";
import { useUserStore } from "../stores/userStore";

type StickerCDN = { [key: string]: Sticker };

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
  const [ref, bounds] = useMeasure();

  useEffect(() => {
    let currentStyle = {};
    if (style) {
      currentStyle = style;
    }
    switch (roomID) {
      case "chris": {
        let chrisStyle = {
          "--stickerSize": "10ch",
        } as React.CSSProperties;
        currentStyle = { ...chrisStyle, ...style };
      }
    }
    setStickerStyle(currentStyle);
  }, [roomID, style]);

  const addSticker = (pos: Pos, cdnID: string) => {
    if (!roomID) return;
    addStickerInstance(roomID, {
      position: pos,
      timestamp: Date.now(),
      cdnID: cdnID,
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
          <StickerChooser addSticker={addSticker} cdn={stickerCDN} />
          <ServerStickers roomID={roomID} key={`${roomID}-sscoins`} cdn={stickerCDN} containerBounds={bounds} />
        </>
      )}
    </div>
  ) : null;
};

interface StickerAdderProps {
  addSticker: (pos: Pos, cdnID: string) => void;
  cdn: StickerCDN;
}
const DefaultStickerAdder: React.FC<StickerAdderProps> = ({ addSticker, cdn }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showStickerTypePicker, setShowStickerTypePicker] = useState<boolean>(false);
  const currentPosChosen = useRef<Pos>();
  const clicked: MouseEventHandler<HTMLDivElement> = (e) => {
    if (!showStickerTypePicker) {
      if (containerRef.current && cdn && Object.keys(cdn).length > 0) {
        let bounds = containerRef.current.getBoundingClientRect();
        let x = e.pageX / bounds.width;
        let y = e.pageY / bounds.height;
        currentPosChosen.current = [x, y];
        setShowStickerTypePicker(true);
      }
    } else {
      setShowStickerTypePicker(false);
    }
  };
  const typeChosen = (id?: string) => {
    setShowStickerTypePicker(false);
    if (id) {
      if (currentPosChosen.current) {
        addSticker(currentPosChosen.current || [0, 0], id);
      } else {
        console.log("Something bad happened");
      }
    }
  };
  return (
    <div
      className={classnames("fullBleed absoluteOrigin high", {
        addCursor: !showStickerTypePicker,
        closeCursor: showStickerTypePicker,
      })}
      onClick={clicked}
      ref={containerRef}
    >
      {showStickerTypePicker ? (
        <div
          className="absoluteOrigin "
          style={{
            top: `${currentPosChosen.current ? currentPosChosen.current[1] * 100 : 80}%`,
            left: `${currentPosChosen.current ? currentPosChosen.current[0] * 100 : 50}%`,
          }}
        >
          <DefaultChooseStickerType cdn={cdn} typeSelected={typeChosen} />
        </div>
      ) : null}
    </div>
  );
};
const DefaultChooseStickerType: React.FC<{ cdn: StickerCDN; typeSelected: (id?: string) => void }> = ({
  cdn,
  typeSelected,
}) => {
  return (
    <>
      <div
        className="grid:s-2 skrimFill border-radius padded"
        style={{ maxWidth: "calc(4 * (var(--stickerSize) + 2 * var(--s2))" }}
      >
        <div
          className="lightFill border contrastFill:hover padded:s-2 clickable highest"
          style={{ position: "absolute", top: "calc(-1 * var(--s1)", left: "calc(-1 * var(--s1)" }}
          onClick={(e) => typeSelected(undefined)}
        >
          cancel
        </div>
        {Object.keys(cdn).map((k) => (
          <div className="clickable:opacity" key={`choosesticker-${k}`} onClick={(e) => typeSelected(k)}>
            <StickerImage url={cdn[k].imageURL} />
          </div>
        ))}
      </div>
    </>
  );
};

const ServerStickers: React.FC<{ roomID: string; cdn: StickerCDN; containerBounds: RectReadOnly }> = ({
  roomID,
  cdn,
  containerBounds,
}) => {
  let [serverSideCoins, setServerSideCoins] = useState<{ [key: string]: StickerInstance }>({});
  const unsub = useRef<Unsubscribe>();

  const stickerPosUpdated = useCallback(
    (cID, pos) => {
      setServerSideCoins((pc) => {
        let npc = { ...pc };
        npc[cID].position = pos;
        console.log("Updating pos");
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
      unsub.current = syncStickerInstances(roomID, stickerAdded, stickerRemoved, stickerPosUpdated);
    }
    setupServerSync();
    return () => unsub.current && unsub.current();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {Object.entries(serverSideCoins).map(
        ([id, stickerInstance]) =>
          cdn[stickerInstance.cdnID] && (
            <StickerRenderer
              key={`servercoin-${id}`}
              pos={stickerInstance.position}
              sticker={cdn[stickerInstance.cdnID]}
              id={id}
              containerBounds={containerBounds}
            />
          )
      )}
    </>
  );
};

interface StickerRenderProps {
  sticker: Sticker;
  pos: Pos;
  id: string;
  containerBounds: RectReadOnly;
}

const StickerRenderer: React.FC<StickerRenderProps> = (props) => {
  const currentRoomID = useRoomStore(useCallback( s => s.currentRoomID, []));
  const adminForIDs = useUserStore(useCallback(s => s.adminFor, []));
  const stickerToUse = useMemo(() => {
    
    console.log(currentRoomID, adminForIDs);
    if (!props.pos && !props.sticker) return <span> </span>;
    if (adminForIDs && currentRoomID && adminForIDs.includes(currentRoomID)) return <DeletableSticker {...props}/>
    switch (props.sticker.behaviorType) {
      case "MOVE":
        return <MoveableSticker {...props} />;
      case "DELETE":
        return <DeletableSticker {...props} />
      case "NORMAL":
      default:
        return <StaticSticker {...props} />;
    }
  }, [props, adminForIDs, currentRoomID]);

  return stickerToUse;

};

const DeletableSticker: React.FC<StickerRenderProps> = ({ sticker, pos, id }) => {
  const roomID = useRoomStore(useCallback((state) => state.currentRoomID, []));
  const deleteSticker = () => {
     roomID && deleteStickerInstance(roomID, id);
  }
  return (
    <div
      style={{ left: `${pos[0] * 100}%`, top: `${pos[1] * 100}%` }}
      onClick={(e) => deleteSticker()}
      className={"absoluteOrigin deleteCursor highest"}
    >
      <StickerImage url={sticker.imageURL} />
    </div>
  );
};
const MoveableSticker: React.FC<StickerRenderProps> = ({ sticker, pos, id, containerBounds }) => {
  const myRef = createRef<HTMLDivElement>();
  const roomID = useRoomStore(useCallback((state) => state.currentRoomID, []));
  const [isDragging, setIsDragging] = useState(false);

  const dragEnded: DraggableEventHandler = (e, data) => {
    setIsDragging(false);
    let newPos: Pos = [data.x / containerBounds.width, data.y / containerBounds.height];
    roomID && updateStickerInstancePos(roomID, id, newPos);
  };
  return roomID && containerBounds ? (
    <Draggable
      onStop={dragEnded}
      onStart={() => setIsDragging(true)}
      position={{ x: pos[0] * containerBounds.width, y: pos[1] * containerBounds.height }}
      nodeRef={myRef}
    >
      <div className={classnames("moveCursor absoluteOrigin highest", { animateTransform: !isDragging })} ref={myRef}>
        <StickerImage url={sticker.imageURL} />
      </div>
    </Draggable>
  ) : null;
};

const StaticSticker = ({ sticker, pos }: StickerRenderProps) => (
  <div style={{ left: `${pos[0] * 100}%`, top: `${pos[1] * 100}%` }} className={"absoluteOrigin"}>
    <StickerImage url={sticker.imageURL} />
  </div>
);

const StickerImage = ({ url }: { url: string }) => (
  <img src={url} className="noEvents" alt={"Sticker"} style={{ width: "var(--stickerSize)" }} />
);

export default Stickers;
