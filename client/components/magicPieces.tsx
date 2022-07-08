/* eslint-disable @next/next/no-img-element */
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { DraggableCore, DraggableEventHandler } from "react-draggable"; // <DraggableCore>
import { disableMagicPiecesSync, syncMagicPieces } from "../lib/firebase";
import {useCollective}  from "../stores/useEnergy";
import useCurrentStreamName from "../stores/useCurrentStreamName";
import useMagicPieces from "../stores/useMagicPieces";
import useWindowDimensions from "../stores/useWindowDimensions";

//Types
//TODO: Move these types to a separate file
type MagicPieceTriggerTypes = "click" | "drag" | "follow";



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
const MagicPieceViewer: React.FunctionComponent<MagicPiece> = ({ pos, asset, triggerType, id, reward }) => {
  const renderElement = ( asset ? <img src={asset} alt="piece" /> : "?");

  const pieceProps = { ix: pos.x, iy: pos.y, id,  reward};
  switch (triggerType) {
    case "drag":
      return (
        <MagicPieceDragPositioner {...pieceProps}>
          {renderElement}
        </MagicPieceDragPositioner>
      );
    case "click":
      return (
        <MagicPieceClickPositioner {...pieceProps}>
          {renderElement}
        </MagicPieceClickPositioner>
      )
    default:
      return (
        <MagicPieceStaticPositioner {...pieceProps}>
          {renderElement}
        </MagicPieceStaticPositioner>
      );
  }
};

interface MagicPiecePositionerProps {
  ix: number;
  iy: number;
  id: string;
  reward?: number;
}

const constructStyleHelper  = (x: number, y: number) : React.CSSProperties=> {
  return { position: "absolute", top: `${y * 100}%`, left: `${x * 100}%` }
}


//TODO: How to compose this so I dont have to write the same useEffect (Getting server updates) every time?
const MagicPieceDragPositioner: React.FunctionComponent<MagicPiecePositionerProps> = ({ ix, iy, id, children, reward }) => {
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: ix, y: iy });
  const [amDragging, setAmDragging] = useState<boolean>(false);
  const { updatePiecePos } = useMagicPieces();
  const nodeRef = useRef(null);
  const { width, height } = useWindowDimensions();
  const { addReward} = useCollective();

  useEffect(() => {
    if (ix !== undefined && iy !== undefined) {
      //console.log("pos updated outside drag" + ix + " " + iy);
      setPos((pp) => (ix != pp.x || iy != pp.y ? { x: ix, y: iy } : pp));
    }
  }, [ix, iy, setPos]);

  const handleStart: DraggableEventHandler = (e, data) => {
    setAmDragging(true);
  };

  const handleDrag: DraggableEventHandler = (e, data) => {
    const nX = data.x / width;
    const nY = data.y / height;
    setPos({ x: nX, y: nY });
  };

  const handleEnd: DraggableEventHandler = (e, data) => {
    setAmDragging(false);
    //console.log("dragging complete to: " + pos.x + " " + pos.y);
    updatePiecePos(id, pos.x, pos.y);
    if (reward) addReward(reward);
  };

  return (
    <DraggableCore nodeRef={nodeRef} onStart={handleStart} onDrag={handleDrag} onStop={handleEnd}>
      <div
        style={constructStyleHelper(pos.x, pos.y)}
        className={classNames({ draggable: true, active: amDragging, square: true})}
        ref={nodeRef}
        key={id}
      >
        {children}
      </div>
    </DraggableCore>
  );
};

const MagicPieceClickPositioner: React.FunctionComponent<MagicPiecePositionerProps> = ({ix, iy, id, children, reward}) => {
  const {addReward} = useCollective();
  const handleClick : React.EventHandler<React.MouseEvent> = (e) => {
    if (reward) {
      e.preventDefault();
      addReward(reward);
    }
  }
  return (
    <div style={constructStyleHelper(ix, iy)} className={classNames({ circle: true, clickable: true })} key={id} onClick={handleClick}>
      {children}
    </div>
  );
  
};
const MagicPieceStaticPositioner: React.FunctionComponent<MagicPiecePositionerProps> = ({ ix, iy, id, children }) => {
  return (
    <div style={constructStyleHelper(ix, iy)} className="placeholder" key={id}>
      {children}
    </div>
  );
};
