import { createRef, useCallback, useMemo, useState } from "react";
import Draggable, { DraggableEventHandler } from "react-draggable";
import { RectReadOnly } from "react-use-measure";
import { useRoomStore } from "../../stores/roomStore";
import {
  deleteStickerInstance,
  updateStickerInstancePos,
} from "../../lib/firestore";
import classnames from "classnames";
import { useAdminStore } from "../../stores/adminStore";

interface StickerRenderProps {
  sticker: Sticker;
  pos: Pos;
  size?: number;
  zIndex: number;
  id: string;
  containerBounds: RectReadOnly;
}

const getStickerWidth = (size?: number) => {
  return size ? `${size * 100}%` : "var(--stickerSize)";
};

const getStickerStyle = (pos: Pos, size?: number, zIndex?: number) => {
  return {
    left: `${pos[0] * 100}%`,
    top: `${pos[1] * 100}%`,
    width: getStickerWidth(size),
    zIndex: zIndex || 1,
  };
};

export const StickerRenderer: React.FC<StickerRenderProps> = (props) => {
  const behaviorOverride = useAdminStore(
    useCallback((s) => s.stickerBehaviorOverride, []),
  );
  const stickerToUse = useMemo(() => {
    if (!props.pos && !props.sticker) return <span> </span>;
    let bt = props.sticker.behaviorType;
    if (behaviorOverride) bt = behaviorOverride;
    switch (bt) {
      case "MOVE":
        return <MoveableSticker {...props} />;
      case "DELETE":
        return <DeletableSticker {...props} />;
      default:
        return <StaticSticker {...props} />;
    }
  }, [behaviorOverride, props]);
  return stickerToUse;
};

export const DeletableSticker: React.FC<StickerRenderProps> = ({
  sticker,
  pos,
  id,
  size,
  zIndex,
}) => {
  const roomID = useRoomStore(useCallback((state) => state.currentRoomID, []));
  const deleteSticker = () => {
    roomID && deleteStickerInstance(roomID, id);
  };
  return (
    <div
      style={getStickerStyle(pos, size, zIndex)}
      onClick={(e) => deleteSticker()}
      className={
        "absoluteOrigin deleteCursor interactiveStickerLayer hoverTrigger"
      }
    >
      <StickerImage url={sticker.imageURL} size={size} id={id} />
    </div>
  );
};

export const StaticSticker = ({
  sticker,
  pos,
  size,
  zIndex,
  id,
}: StickerRenderProps) => (
  <div
    style={getStickerStyle(pos, size, zIndex)}
    className={"absoluteOrigin noEvents"}
  >
    <StickerImage url={sticker.imageURL} size={size} id={id} />
  </div>
);

const MoveableSticker: React.FC<StickerRenderProps> = ({
  sticker,
  pos,
  id,
  containerBounds,
  size,
  zIndex,
}) => {
  const myRef = createRef<HTMLDivElement>();
  const roomID = useRoomStore(useCallback((state) => state.currentRoomID, []));
  const [isDragging, setIsDragging] = useState(false);
  const dragEnded: DraggableEventHandler = (e, data) => {
    setIsDragging(false);
    let newPos: Pos = [
      data.x / containerBounds.width,
      data.y / containerBounds.height,
    ];
    roomID && updateStickerInstancePos(roomID, id, newPos);
  };
  return roomID && containerBounds ? (
    <Draggable
      onStop={dragEnded}
      onStart={() => setIsDragging(true)}
      bounds={{
        left: containerBounds.left - 0.1 * containerBounds.width,
        top: containerBounds.top - 0.1 * containerBounds.height,
        right: 0.9 * containerBounds.width,
        bottom: containerBounds.bottom,
      }}
      position={{
        x: pos[0] * containerBounds.width,
        y: pos[1] * containerBounds.height,
      }}
      nodeRef={myRef}
    >
      <div
        className={classnames(
          "moveCursor absoluteOrigin interactiveStickerLayer hoverTrigger",
          { animateTransform: !isDragging },
        )}
        style={{ width: getStickerWidth(size), zIndex: zIndex || 1 }}
        ref={myRef}
      >
        <StickerImage url={sticker.imageURL} size={size} id={id} />
      </div>
    </Draggable>
  ) : null;
};

export const StickerImage = ({
  url,
  size,
  id,
}: {
  url: string;
  size?: number;
  id?: string;
}) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={url}
    className="noEvents noSelect glow:hover"
    alt={"Sticker"}
    style={{ width: "100%" }}
    id={id}
  />
);
