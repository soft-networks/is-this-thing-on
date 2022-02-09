/* eslint-disable @next/next/no-img-element */
import classNames from "classnames";
import { posix } from "path/posix";
import { useEffect, useRef, useState } from "react";
import { DraggableCore, DraggableEventHandler } from "react-draggable"; // <DraggableCore>
import { disableMagicPiecesSync, syncMagicPieces } from "../lib/firebase";
import useCurrentStreamName from "../useHooks/useCurrentStreamName";
import useMagicPieces from "../useHooks/useMagicPieces";
import useWindowDimensions from "../useHooks/useWindowDimensions";

//Types
//TODO: Move these types to a separate file
type MagicPieceTriggerTypes = "click" | "drag" | "follow";

export interface MagicPiece {
  id: string;
  triggerType?: MagicPieceTriggerTypes;
  pos: { x: number; y: number };
  asset?: string;
}

//Many Viewer
export const MagicPiecesViewer: React.FunctionComponent = () => {
  const { pieces } = useMagicPieces();
  const id = useCurrentStreamName();
  return (
    <div
      className="full-bleed cursor-passthrough"
      style={{ position: "absolute", top: 0, left: 0 }}
      key={`magicPieces-${id}`}
    >
      {pieces.map((magicPiece) => (
        <MagicPieceViewer {...magicPiece} key={magicPiece.id} />
      ))}
    </div>
  );
};

//Individual viewer
const MagicPieceViewer: React.FunctionComponent<MagicPiece> = ({ pos, asset, triggerType, id }) => {
  const renderElement = ( asset ? <img src={asset} alt="piece" /> : "?");

  switch (triggerType) {
    case "drag":
      return (
        <MagicPieceDragPositioner ix={pos.x} iy={pos.y} id={id}>
          {renderElement}
        </MagicPieceDragPositioner>
      );
    default:
      return (
        <MagicPieceStaticPositioner ix={pos.x} iy={pos.y} id={id}>
          {renderElement}
        </MagicPieceStaticPositioner>
      );
  }
};

interface MagicPiecePositionerProps {
  ix: number;
  iy: number;
  id: string;
}
//TODO: How to compose this so I dont have to write the same useEffect (Getting server updates) every time?
const MagicPieceDragPositioner: React.FunctionComponent<MagicPiecePositionerProps> = ({ ix, iy, id, children }) => {
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: ix, y: iy });
  const [amDragging, setAmDragging] = useState<boolean>(false);
  const { updatePiecePos } = useMagicPieces();
  const nodeRef = useRef(null);
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    if (ix !== undefined && iy !== undefined) {
      console.log("pos updated outside drag" + ix + " " + iy);
      setPos((pp) => (ix != pp.x || iy != pp.y ? { x: ix, y: iy } : pp));
    }
  }, [ix, iy, setPos]);

  const handleStart: DraggableEventHandler = (e, data) => {
    console.log("start");
    setAmDragging(true);
  };

  const handleDrag: DraggableEventHandler = (e, data) => {
    const nX = data.x / width;
    const nY = data.y / height;
    setPos({ x: nX, y: nY });
  };

  const handleEnd: DraggableEventHandler = (e, data) => {
    //todo: sync last bits to server
    setAmDragging(false);
    console.log("dragging complete to: " + pos.x + " " + pos.y);
    updatePiecePos(id, pos.x, pos.y);
  };

  return (
    <DraggableCore nodeRef={nodeRef} onStart={handleStart} onDrag={handleDrag} onStop={handleEnd}>
      <div
        style={{ position: "absolute", top: `${pos.y * 100}%`, left: `${pos.x * 100}%` }}
        className={classNames({ draggable: true, active: amDragging, square: true})}
        ref={nodeRef}
      >
        {children}
      </div>
    </DraggableCore>
  );
};

const MagicPieceStaticPositioner: React.FunctionComponent<MagicPiecePositionerProps> = ({ ix, iy, id, children }) => {
  return (
    <div style={{ position: "absolute", top: `${iy * 100}%`, left: `${ix * 100}%` }} className="placeholder">
      {children}
    </div>
  );
};
