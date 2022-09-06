import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ROOM_NAMES, {ONLINE_URLS, ROOM_COLORS} from "../../../common/commonData";

const ELLIPSE_PATH =
  "M71.25,84.27L177.31,22.66,297.1,3.07l100.91,27.55,55.04,66.55-4.58,87.99-63.6,86.7-106.07,61.62-119.79,19.59-100.91-27.55L3.06,258.97l4.58-87.99,63.61-86.7Z";

const ANIM_LENGTH = 100;
const ANIM_OFFSET = ANIM_LENGTH/ ROOM_NAMES.length;

interface LogoProps {
  linkList: RoomLinkInfo[];
  collapsed?: boolean
}

const Logo: React.FC<LogoProps> = ({linkList}) => {
  const [currentStream, setCurrentStream] = useState<number>(0);
  const animInterval = useRef<NodeJS.Timeout>();
  const incCurrentStream = useCallback(() => {
    setCurrentStream((c) => (c + 1) % ROOM_NAMES.length);
    animInterval.current && clearTimeout(animInterval.current)
    animInterval.current = setTimeout(incCurrentStream, 5000);
  }, []);
  const decCurrentStream = useCallback(() => {
    setCurrentStream((c) => (c == 0 ? ROOM_NAMES.length - 1 : c - 1));
    animInterval.current && clearTimeout(animInterval.current)
    animInterval.current = setTimeout(incCurrentStream, 5000);
  }, [incCurrentStream]);
  useEffect(() => {
    animInterval.current = setTimeout(incCurrentStream, 5000);
    return () => animInterval.current && clearTimeout(animInterval.current)
  }, [incCurrentStream])
  const nodes = useMemo(() => {
    let nodeDom = [];
    for (let i = 0; i < ROOM_NAMES.length; i++) {
      nodeDom.push(<LogoNode offset={i} myColor={ROOM_COLORS[i]} showColor={currentStream == i} key={`node-${i}`} />);
    }
    return nodeDom;
  }, [currentStream]);

  return (
    <div
      className="fullWidth stack:custom relative"
      style={{ "--stackSpacing": "calc(-1 * var(--s-1))", marginTop: "calc(-1 * var(--s2))" } as React.CSSProperties}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="centerh higher homeLogoWidth" viewBox="-50 -50 550 450">
        <defs>
          <style>{`.stroke{stroke:#000;stroke-width:5px}`}</style>
        </defs>
        <text x={150} y={210} style={{ fontSize: "55px", fontStyle: "italic" }}>
          THING
        </text>
        <path className="stroke" fill={"none"} d={ELLIPSE_PATH} id="ellipsePath" />
        {nodes}
      </svg>
      <div className="horizontal-stack:s-1 centerh">
        <div className="clickable border padded:s-2 contrastFill:hover" onClick={decCurrentStream}>
          prev
        </div>
        <NodeLink
          roomName={linkList[currentStream].roomName}
          roomColor={linkList[currentStream].roomColor || "gray"}
          roomLink={linkList[currentStream].streamStatus == "active" ? ONLINE_URLS[currentStream] : undefined}
        />
        <div className="clickable border padded:s-2 contrastFill:hover" onClick={incCurrentStream}>
          next
        </div>
      </div>
    </div>
  );
};

const LogoSVG = () => {
  
}

interface LogoNodeProps {
  offset: number;
  myColor: string;
  showColor: boolean;
}
const LogoNode: React.FC<LogoNodeProps> = ({ offset, myColor, showColor }) => {
  return (
    <g key={`node-${offset}`} >
      <rect
        className="stroke"
        width="40"
        height="40"
        fill={showColor ? myColor : "#fff"}
        transform={`rotate(45) translate(-20,-20)`}
      ></rect>
      <animateMotion dur={`${ANIM_LENGTH}s`} begin={`${offset * -ANIM_OFFSET}s`} repeatCount="indefinite">
        <mpath xlinkHref="#ellipsePath" />
      </animateMotion>
    </g>
  );
};

const NodeLink = ({roomLink, roomName, roomColor} : {roomLink?: string, roomName: string, roomColor: string}) => {
  return (
    <div className="border padded:s-2 center-text" style={{ backgroundColor: roomColor }}>
      {roomLink ? (
        <a href={roomLink} target="_blank" rel="noreferrer">
          {roomName} is online
        </a>
      ) : (
        <span>{roomName} is offline</span>
      )}
    </div>
  );
}

export default Logo;

