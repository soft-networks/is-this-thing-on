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
  updateStickerInstanceScale,
  updateStickerInstanceZIndex,
} from "../lib/firestore";
import { stickerInstanceCollection } from "../lib/firestore/locations";
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
      zIndex: 1000
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
        {Object.keys(cdn).map(
          (k) =>
            !cdn[k].noGift && (
              <div
                className="clickable:opacity"
                key={`choosesticker-${k}`}
                onClick={(e) => typeSelected(k)}
                style={{ width: "var(--stickerSize)" }}
              >
                <StickerImage url={cdn[k].imageURL} />
              </div>
            )
        )}
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
  const currentRoomID = useRoomStore(useCallback((s) => s.currentRoomID, []));
  const adminForIDs = useUserStore(useCallback((s) => s.adminFor, []));
  const isAdmin = useMemo(
    () => adminForIDs && currentRoomID && adminForIDs.includes(currentRoomID),
    [adminForIDs, currentRoomID]
  );
  const [behaviorOverride, setBehaviorOverride] = useState<BEHAVIOR_TYPES>();

  const stickerUpdated = useCallback(
    (cID, pos, scale, z) => {
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
      {Object.entries(serverSideCoins).map(
        ([id, stickerInstance]) =>
          cdn[stickerInstance.cdnID] && (
            <StickerRenderer
              key={`servercoin-${id}`}
              pos={stickerInstance.position}
              size={stickerInstance.size}
              sticker={cdn[stickerInstance.cdnID]}
              id={id}
              containerBounds={containerBounds}
              adminOverride={behaviorOverride} zIndex={stickerInstance.zIndex}            />
          )
      )}
      {isAdmin && (
        <div style={{ position: "fixed", top: 0, right: 0 }} className="horizontal-stack padded highest">
          <div className="clickable contrastFill:hover" onClick={() => setBehaviorOverride("MOVE")}>
            {"MOVE"} MODE
          </div>
          <div className="clickable contrastFill:hover" onClick={() => setBehaviorOverride("DELETE")}>
            {"DELETE"} MODE
          </div>
          <div className="clickable contrastFill:hover" onClick={() => setBehaviorOverride("SCALE")}>
            {"SCALE/ZINDEX"} MODE
          </div>
          <div className="clickable contrastFill:hover" onClick={() => setBehaviorOverride(undefined)}>
            {"USER"} MODE
          </div>
        </div>
      )}
    </>
  );
};

interface StickerRenderProps {
  sticker: Sticker;
  pos: Pos;
  size?: number;
  zIndex: number;
  id: string;
  containerBounds: RectReadOnly;
  adminOverride?: BEHAVIOR_TYPES;
}

const StickerRenderer: React.FC<StickerRenderProps> = (props) => {
  const stickerToUse = useMemo(() => {
    if (!props.pos && !props.sticker) return <span> </span>;
    let bt = props.sticker.behaviorType;
    if (props.adminOverride) bt = props.adminOverride;
    switch (bt) {
      case "SCALE":
        return <ResizableSticker {...props} />;
      case "MOVE":
        return <MoveableSticker {...props} />;
      case "DELETE":
        return <DeletableSticker {...props} />;
      case "NORMAL":
      default:
        return <StaticSticker {...props} />;
    }
  }, [props]);
  return stickerToUse;
};

const DeletableSticker: React.FC<StickerRenderProps> = ({ sticker, pos, id, size, zIndex }) => {
  const roomID = useRoomStore(useCallback((state) => state.currentRoomID, []));
  const deleteSticker = () => {
    roomID && deleteStickerInstance(roomID, id);
  };
  return (
    <div
      style={{
        left: `${pos[0] * 100}%`,
        top: `${pos[1] * 100}%`,
        width: size ? `${size * 100}%` : "var(--stickerSize)",
        zIndex: zIndex
      }}
      onClick={(e) => deleteSticker()}
      className={"absoluteOrigin deleteCursor highest"}
    >
      <StickerImage url={sticker.imageURL} size={size} />
    </div>
  );
};

const MoveableSticker: React.FC<StickerRenderProps> = ({ sticker, pos, id, containerBounds, size, zIndex}) => {
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
      <div
        className={classnames("moveCursor absoluteOrigin highest", { animateTransform: !isDragging })}
        style={{ width: size ? `${size * 100}%` : "var(--stickerSize)" , zIndex: zIndex}}
        ref={myRef}
      >
        <StickerImage url={sticker.imageURL} size={size} />
      </div>
    </Draggable>
  ) : null;
};

const ResizableSticker = ({ sticker, pos, id, size , zIndex}: StickerRenderProps) => {
  const [localScale, setLocalScale] = useState<number | undefined>(size);
  const [localZIndex, setLocalZIndex] = useState<number | undefined>(size);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [lockHover, setLockHover] = useState<boolean>(false);
  const roomID = useRoomStore(useCallback((state) => state.currentRoomID, []));
  useEffect(() => {
    roomID && localScale && updateStickerInstanceScale(roomID, id, localScale);
  }, [id, localScale, roomID]);
  useEffect(() => {
    roomID && localZIndex && updateStickerInstanceZIndex(roomID, id, localZIndex);
  }, [id, localZIndex, roomID]);
  const updateScale = (n: number) => {
    if (localScale == undefined) {
      setLocalScale(0.1);
      return;
    }
    let nlsc = Math.max(localScale + n, 0.01);
    setLocalScale(nlsc);
  };
  const updateZIndex = (n: number) => {
    if (localZIndex == undefined) {
      setLocalZIndex(100);
      return;
    }
    let nz = Math.max(localZIndex + n, 100);
    setLocalZIndex(nz);
  }
  return (
    <div
      style={{
        left: `${pos[0] * 100}%`,
        top: `${pos[1] * 100}%`,
        width: size ? `${size * 100}%` : "var(--stickerSize)",
        background: isEditing ? "rgba(255,255,255,0.6)" : undefined,
        opacity: (lockHover || isEditing) ? 1.0 : 0.5,
        pointerEvents: "none",
        zIndex: zIndex
      }}
      className={classnames("absoluteOrigin highest", { everest: isEditing })}
    >
      <div className="horizontal-stack:s-2 everest center:absolute" style={{pointerEvents: "all"}}>
        <div
          className="padded:s-3 whiteFill everest contrastFill:hover clickable"
          onMouseOver={() => setLockHover(true)}
          onMouseOut={() => setLockHover(false)}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "unlock" : "lock"}{" "}
        </div>
        {isEditing && (
          <div className="padded:s-3 everest whiteFill contrastFill:hover clickable" onClick={() => updateScale(0.05)}>
            +
          </div>
        )}
        {isEditing && (
          <div className="padded:s-3 everest whiteFill contrastFill:hover clickable" onClick={() => updateScale(-0.05)}>
            -
          </div>
        )}
         {isEditing && (
          <div className="padded:s-3 everest whiteFill contrastFill:hover clickable" onClick={() => updateZIndex(1)}>
            forward
          </div>
        )}
         {isEditing && (
          <div className="padded:s-3 everest whiteFill contrastFill:hover clickable" onClick={() => updateZIndex(-1)}>
            backward
          </div>
        )}
      </div>
      <StickerImage url={sticker.imageURL} size={size} />
    </div>
  );
};

const StaticSticker = ({ sticker, pos, size, zIndex }: StickerRenderProps) => (
  <div
    style={{ left: `${pos[0] * 100}%`, top: `${pos[1] * 100}%`, width: size ? `${size * 100}%` : "var(--stickerSize)", zIndex: zIndex }}
    className={"absoluteOrigin"}
  >
    <StickerImage url={sticker.imageURL} size={size} />
  </div>
);

const StickerImage = ({ url, size }: { url: string; size?: number }) => (
  <img src={url} className="noEvents" alt={"Sticker"} style={{ width: "100%" }} />
);

export default Stickers;
