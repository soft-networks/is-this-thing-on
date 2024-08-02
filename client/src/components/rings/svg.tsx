import classNames from "classnames";
import { useRouter } from "next/router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { roomIDToHREF } from "../../stores/ringStore";
import { roomIsActive, useRoomStore } from "../../stores/roomStore";

const ELLIPSE_PATH =
  "M71.25,84.27L177.31,22.66,297.1,3.07l100.91,27.55,55.04,66.55-4.58,87.99-63.6,86.7-106.07,61.62-119.79,19.59-100.91-27.55L3.06,258.97l4.58-87.99,63.61-86.7Z";

const GLOBAL_ANIM_LENGTH = 100;

interface SVGRingProps {
  ring: WebRing;
  currentlySelected?: number;
  onNodeClick?: (nodeIndex: number) => void;
}
export const SVGRingSeparate = (
  props: SVGRingProps & { returnWithoutWrapping?: boolean },
) => {
  const pieces = [
    <path key="path-outline" fill={"none"} d={ELLIPSE_PATH} id="ellipsePath" />,
    <SVGNodes key="path-nodes" {...props} />,
  ];
  if (props.returnWithoutWrapping) {
    return pieces;
  }
  const wrapSVG = (child: JSX.Element) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="centerh homeLogoWidth"
      viewBox="-50 -50 550 450"
    >
      {child}
    </svg>
  );
  return pieces.map((p) => wrapSVG(p));
};

const SVGNodes: React.FC<SVGRingProps> = ({
  ring,
  currentlySelected,
  onNodeClick,
}) => {
  const nodes = useMemo(() => {
    const numKeys = Object.keys(ring).length;
    const ANIM_OFFSET = GLOBAL_ANIM_LENGTH / numKeys;
    let nodeDom = [];
    let keys = Object.keys(ring);
    for (let i = 0; i < numKeys; i++) {
      let iLink = ring[keys[i]];
      nodeDom.push(
        <SVGRingNode
          index={i}
          myColor={iLink.roomColor}
          showColor={roomIsActive(iLink)}
          key={`node-${i}`}
          ANIM_OFFSET={ANIM_OFFSET}
          selected={currentlySelected == i}
          onClick={onNodeClick}
          ANIM_LENGTH={GLOBAL_ANIM_LENGTH}
        />,
      );
    }
    return nodeDom;
  }, [currentlySelected, onNodeClick, ring]);

  return <>{nodes}</>;
};
interface SVGRingNodeProps {
  index: number;
  myColor: string;
  showColor: boolean;
  ANIM_OFFSET: number;
  ANIM_LENGTH: number;
  selected?: boolean;
  onClick?: (myIndex: number) => void;
  hoverBehavior?: boolean;
  name?: string;
}
export const SVGRingNode: React.FC<SVGRingNodeProps> = ({
  index,
  myColor,
  showColor,
  ANIM_OFFSET,
  selected,
  onClick,
  ANIM_LENGTH,
  hoverBehavior,
  name,
}) => {
  return (
    <g
      key={`node-${index}`}
      className={classNames({ showOnHoverTrigger: hoverBehavior })}
    >
      <rect
        className={classNames({
          stroke: true,
          selected: selected,
          clickable: onClick !== undefined,
        })}
        width="80"
        height="20"
        fill={showColor ? myColor : "#fff"}
        transform={`translate(-20,-20)`}
        onClick={() => onClick && onClick(index)}
        vectorEffect="non-scaling-stroke"
      ></rect>
      <animateMotion
        dur={`${ANIM_LENGTH}s`}
        begin={`${index * -ANIM_OFFSET}s`}
        repeatCount="indefinite"
      >
        <mpath xlinkHref="#ellipsePath" />
      </animateMotion>
      {name && (
        <text
          className={classNames({ showOnHover: hoverBehavior })}
          textAnchor="middle"
          transform="translate(0, -40)"
          style={{ filter: `drop-shadow(0px 0px 2px ${myColor || "white"})` }}
        >
          {name}
        </text>
      )}
    </g>
  );
};

interface NodeLinkProps {
  link: RoomLinkInfo;
  className?: string;
  noNav?: boolean;
  id: string;
}
export const NodeLink: React.FC<NodeLinkProps> = ({
  link,
  className,
  noNav,
  id,
}) => {
  const text = useMemo(
    () =>
      `${link.roomName} is ${link.streamStatus.includes("active") ? "online" : "offline"}`,
    [link.roomName, link.streamStatus],
  );
  return (
    <div
      className={`border padded:s-3 center-text ${className}`}
      style={{
        backgroundColor: link.streamStatus.includes("active")
          ? "var(--roomColor)"
          : "var(--white)",
      }}
    >
      {!noNav && link.streamStatus == "active" ? (
        <a href={roomIDToHREF(id)} target="_blank" rel="noreferrer">
          {" "}
          {text}{" "}
        </a>
      ) : (
        <span> {text} </span>
      )}
    </div>
  );
};
