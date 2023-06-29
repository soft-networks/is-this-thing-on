import { createRef, useCallback, useMemo, useState } from "react";
import Draggable, { DraggableEventHandler } from "react-draggable";
import { RectReadOnly } from "react-use-measure";
import { useRoomStore } from "../../stores/roomStore";
import { deleteStickerInstance, updateStickerInstancePos } from "../../lib/firestore";
import classnames from "classnames";

interface StickerRenderProps {
  sticker: Sticker;
  pos: Pos;
  size?: number;
  zIndex: number;
  id: string;
  containerBounds: RectReadOnly;
  adminOverride?: BEHAVIOR_TYPES;
}

export const StickerRenderer: React.FC<StickerRenderProps> = (props) => {
  const stickerToUse = useMemo(() => {
    if (!props.pos && !props.sticker) return <span> </span>;
    let bt = props.sticker.behaviorType;
    if (props.adminOverride) bt = props.adminOverride;
    switch (bt) {
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

export const DeletableSticker: React.FC<StickerRenderProps> = ({ sticker, pos, id, size, zIndex }) => {
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
      className={"absoluteOrigin deleteCursor interactiveStickerLayer hoverTrigger"}
    >
      <StickerImage url={sticker.imageURL} size={size} id={id} />
    </div>
  );
};

export const StaticSticker = ({ sticker, pos, size, zIndex, id }: StickerRenderProps) => (
  <div
    style={{ left: `${pos[0] * 100}%`, top: `${pos[1] * 100}%`, width: size ? `${size * 100}%` : "var(--stickerSize)", zIndex: zIndex }}
    className={"absoluteOrigin noEvents"}
  >
    <StickerImage url={sticker.imageURL} size={size} id={id}/>
  </div>
);


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
      bounds={{ left: containerBounds.left, top: containerBounds.top, right: 0.9 * containerBounds.width , bottom: containerBounds.bottom}}
      position={{ x: pos[0] * containerBounds.width, y: pos[1] * containerBounds.height }}
      nodeRef={myRef}
    >
      <div
        className={classnames("moveCursor absoluteOrigin interactiveStickerLayer hoverTrigger", { animateTransform: !isDragging })}
        style={{ width: size ? `${size * 100}%` : "var(--stickerSize)" , zIndex: zIndex}}
        ref={myRef}
      >
        <StickerImage url={sticker.imageURL} size={size} id={id}/>
      </div>
    </Draggable>
  ) : null;
};



export const StickerImage = ({ url, size, id}: { url: string; size?: number, id?: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={url} className="noEvents glow:hover" alt={"Sticker"} style={{ width: "100%" }} id={id} />
);
