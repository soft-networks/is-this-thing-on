import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { roomIDToHREF } from "../stores/ringStore";
import { useRoomStore } from "../stores/roomStore";

const ELLIPSE_PATH =
  "M71.25,84.27L177.31,22.66,297.1,3.07l100.91,27.55,55.04,66.55-4.58,87.99-63.6,86.7-106.07,61.62-119.79,19.59-100.91-27.55L3.06,258.97l4.58-87.99,63.61-86.7Z";

const ANIM_LENGTH = 100;

interface LogoProps {
  ring: WebRing;
  collapsed?: boolean;
}
const Logo: React.FC<LogoProps> = ({ ring, collapsed }) => {
  return collapsed ? <FooterLogo ring={ring} /> : <HomeLogo ring={ring} />;
};

const FooterLogo: React.FC<{ ring: WebRing }> = ({ ring }) => {
  const {push} = useRouter();
  const roomID = useRoomStore(useCallback((s) => s.currentRoomID, []));
  const indexSelected = useMemo(() => {
    if (!roomID) return;
    let i = Object.keys(ring).indexOf(roomID);
    return i > -1 ? i : undefined;
  }, [ring, roomID]);
  const navStream = useCallback((n : number) => {
    let keys = Object.keys(ring);
    n = n < 0 ? keys.length - 1 : n;
    let nextKey = keys[n % keys.length];
    push(roomIDToHREF(nextKey));
  }, [push, ring]);
  const ringParts = useMemo(() => SVGRingSeparate({ring, currentlySelected: indexSelected}), [indexSelected, ring]);
  return roomID ? (
    <div className="centerh relative">
      <div className="center:absolute " >
        {ringParts[0]}
      </div>
      <div className="horizontal-stack:s-1">
        <div className="clickable border padded:s-2 contrastFill:hover" onClick={() => indexSelected !== undefined && navStream(indexSelected -  1)}>
          prev
        </div>
        <NodeLink link={ring[roomID]} id={roomID} noNav />
        <div className="clickable border padded:s-2 contrastFill:hover" onClick={() => indexSelected !== undefined && navStream(indexSelected + 1)}>
          next
        </div>
      </div>
      <div className="center:absolute highest noEvents" >
        {ringParts[1]}
      </div>
    </div>
  ) : (
    null
  );
};

const HomeLogo: React.FC<{ ring: WebRing }> = ({ ring }) => {
  const numKeys = useMemo(() => Object.keys(ring).length, [ring]);
  const [selectedRoom, setSelectedRoom] = useState<number>(0);
  const animInterval = useRef<NodeJS.Timeout>();
  const incCurrentStream = useCallback(() => {
    setSelectedRoom((c) => (c + 1) % numKeys);
  }, [numKeys]);
  useEffect(() => {
    animInterval.current && clearTimeout(animInterval.current);
    animInterval.current = setTimeout(incCurrentStream, 5000);
    return () => animInterval.current && clearTimeout(animInterval.current);
  }, [incCurrentStream, selectedRoom]);
  const nodeNav = useMemo(() => {
    let activeKey = Object.keys(ring)[selectedRoom];
    let link = ring[activeKey];
    if (!link) return <div className="centerh"> loading... </div>;
    return (
      <div className="horizontal-stack:s-1 centerh">
        <NodeLink
          link={link}
          id={activeKey}
          className={classNames({ selected: true })}
        />
      </div>
    );
  }, [selectedRoom, ring]);
  return (
    <div
      className="fullWidth stack:custom relative"
      style={{ "--stackSpacing": "calc(-1 * var(--s-1))", marginTop: "calc(-1 * var(--s2))" } as React.CSSProperties}
    >
      {<SVGRingCombined ring={ring} currentlySelected={selectedRoom} onNodeClick={(n) => setSelectedRoom(n)} />}
      {nodeNav}
    </div>
  );
};

interface SVGRingProps {
  ring: WebRing;
  currentlySelected?: number;
  onNodeClick?: (nodeIndex: number) => void;
}
const SVGRingSeparate = (props: SVGRingProps) => {
  const wrapSVG = (child: JSX.Element) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="centerh higher homeLogoWidth" viewBox="-50 -50 550 450">
      {child}
    </svg>
  )
  return [wrapSVG(<path className="stroke" fill={"none"} d={ELLIPSE_PATH} id="ellipsePath"/>), wrapSVG(<SVGNodes {...props}/>)];
}
const SVGRingCombined = (props: SVGRingProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="centerh higher homeLogoWidth" viewBox="-50 -50 550 450">
      <text x={150} y={210} style={{ fontSize: "55px", fontStyle: "italic" }}>
        THING
      </text>
      <path className="stroke" fill={"none"} d={ELLIPSE_PATH} id="ellipsePath"/>
      <SVGNodes {...props} />
    </svg>
  );
};
const SVGNodes: React.FC<SVGRingProps> = ({ring, currentlySelected, onNodeClick}) => {
  const nodes = useMemo(() => {
    const numKeys = Object.keys(ring).length;
    const ANIM_OFFSET = ANIM_LENGTH / numKeys;
    let nodeDom = [];
    let keys = Object.keys(ring);
    for (let i = 0; i < numKeys; i++) {
      let iLink = ring[keys[i]];
      nodeDom.push(
        <SVGRingNode
          index={i}
          myColor={iLink.roomColor}
          showColor={iLink.streamStatus == "active"}
          key={`node-${i}`}
          ANIM_OFFSET={ANIM_OFFSET}
          selected={currentlySelected == i}
          onClick={onNodeClick}
        />
      );
    }
    return nodeDom;
  }, [currentlySelected, onNodeClick, ring]);

  return <>{nodes}</>
}
interface SVGRingNodeProps {
  index: number;
  myColor: string;
  showColor: boolean;
  ANIM_OFFSET: number;
  selected?: boolean;
  onClick?: (myIndex: number) => void;
}
const SVGRingNode: React.FC<SVGRingNodeProps> = ({ index, myColor, showColor, ANIM_OFFSET, selected, onClick }) => {
  return (
    <g key={`node-${index}`}>
      <rect
        className={classNames({ stroke: true, selected: selected, clickable: onClick !== undefined })}
        width="40"
        height="40"
        fill={showColor ? myColor : "#fff"}
        transform={`rotate(45) translate(-20,-20)`}
        onClick={() => onClick && onClick(index)}
      ></rect>
      <animateMotion dur={`${ANIM_LENGTH}s`} begin={`${index * -ANIM_OFFSET}s`} repeatCount="indefinite">
        <mpath xlinkHref="#ellipsePath" />
      </animateMotion>
    </g>
  );
};

interface NodeLinkProps {
  link: RoomLinkInfo,
  className?: string;
  noNav?: boolean;
  id:string;
}
const NodeLink: React.FC<NodeLinkProps> = ({ link, className, noNav, id}) => {

  const text = useMemo(() => `${link.roomName} is ${link.streamStatus == 'active' ? 'online' : 'offline'}`, [link.roomName, link.streamStatus]);
  return (
    <div className={`border padded:s-2 center-text ${className}`} style={{ backgroundColor: link.streamStatus == 'active' ? link.roomColor : "#eee" }}>
      { !noNav && link.streamStatus == 'active' ?  <a href={roomIDToHREF(id)} target="_blank" rel="noreferrer"> {text} </a> :<span> {text} </span>}
    </div>
  );
};

export default Logo;
