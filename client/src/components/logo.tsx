import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

const ROOM_NAMES = [
  'molly', 'chris', 'semi anonymous friend', 'soft networks'
];

const ROOM_COLORS = [
  '#FFA4F0', '#DBF707', '#A379B8', '#DAF4FF'
]

const ELLIPSE_PATH =
  "M71.25,84.27L177.31,22.66,297.1,3.07l100.91,27.55,55.04,66.55-4.58,87.99-63.6,86.7-106.07,61.62-119.79,19.59-100.91-27.55L3.06,258.97l4.58-87.99,63.61-86.7Z";

const Logo: React.FC = () => {
  const [currentStream, setCurrentStream] = useState<number>(0);

  const decCurrentStream = useCallback(() => {
    setCurrentStream((c) => (c == 0 ? ROOM_NAMES.length - 1 : c - 1));
  }, []);
  const incCurrentStream = useCallback(() => {
    setCurrentStream((c) => (c + 1) % ROOM_NAMES.length);
  }, []);

  const nodes = useMemo(() => {
    let nodeDom = [];
    let offsetStep = 1/ROOM_NAMES.length;
    
    for (let i = 0; i < ROOM_NAMES.length; i++) {
      nodeDom.push(<LogoNode offset={offsetStep * i} myColor={ROOM_COLORS[i]} showColor={currentStream == i} key={`node-${i}`} />);
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
        <text  x={150} y={210} style={{fontSize: "55px", fontStyle: "italic"}}> THING </text>
        <path className="stroke" fill={"none"} d={ELLIPSE_PATH} id="ellipsePath" />
        {nodes}
      </svg>
      <div className="horizontal-stack:s-1 centerh">
        <div className="clickable border padded:s-2" onClick={decCurrentStream}>
          {" "}
          prev{" "}
        </div>
        <div className="border padded:s-2 center-text" style={{ backgroundColor: ROOM_COLORS[currentStream] }}>
          {ROOM_NAMES[currentStream]} is offline{" "}
        </div>
        <div className="clickable border padded:s-2" onClick={incCurrentStream}>
          {" "}
          next{" "}
        </div>
      </div>
    </div>
  );
};

interface LogoNodeProps {
  offset: number;
  myColor: string;
  showColor: boolean;
}
const LogoNode: React.FC<LogoNodeProps> = ({ offset, myColor, showColor }) => {

  const [pos, setMyPos] = useState<Pos>([0,0]);
  const off = useRef<number>(offset);

  const animate = useCallback(() => {
    const pathRef = document.getElementById("ellipsePath") as unknown as SVGGeometryElement ;
    if (!pathRef) {
      return
    }
    const totalLength = pathRef.getTotalLength();
    const myPos = pathRef.getPointAtLength(off.current * totalLength);
    let rx = Math.round((myPos.x + Number.EPSILON) * 100) / 100
    let ry = Math.round((myPos.y + Number.EPSILON) * 100) / 100
    setMyPos([rx, ry]);

    off.current = (off.current + 0.005) % 1;
  },[off])

  useEffect(() => {

    let animateInterval = setInterval(animate, 100);
    return () => clearInterval(animateInterval);
  }, [animate]);



  return (
    <g key={`node-${offset}`} transform={`translate(${pos[0]} ${pos[1]}) `}>
      <rect
        className="stroke"
        width="40"
        height="40"
        fill={showColor ? myColor : "#fff"}
        transform={`rotate(45) translate(-20,-20)`}
      ></rect>
      {/* <animateMotion dur="100s" begin={`${offset * 2}s`} repeatCount="indefinite" rotate={"auto"}>
        <mpath xlinkHref="#ellipsePath" />
      </animateMotion> */}
    </g>
  );
};

export default Logo;
