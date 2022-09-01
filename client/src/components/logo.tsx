import React, { useCallback, useMemo, useState } from "react";
import ROOM_NAMES, {ROOM_COLORS} from "../../../common/commonData";

const ELLIPSE_PATH =
  "M71.25,84.27L177.31,22.66,297.1,3.07l100.91,27.55,55.04,66.55-4.58,87.99-63.6,86.7-106.07,61.62-119.79,19.59-100.91-27.55L3.06,258.97l4.58-87.99,63.61-86.7Z";


const Logo: React.FC = () => {

  const [currentStream, setCurrentStream] = useState<number>(0);

  const decCurrentStream = useCallback(() => {
    setCurrentStream(c => c == 0 ? ROOM_NAMES.length - 1 : c - 1);
  }, []);
  const incCurrentStream = useCallback(() => {
    setCurrentStream(c => (c+1) % ROOM_NAMES.length);
  }, []);

  const nodes = useMemo(()=> {
    let nodeDom = [];
    for (let i =0; i< ROOM_NAMES.length; i++) {
      nodeDom.push( <LogoNode offset={i * 1} myColor={ROOM_COLORS[i]} showColor={currentStream == i} />)
    }
    return nodeDom;
  }, [currentStream])

  return (
    <div
      className="fullWidth stack:custom relative"
      style={{ "--stackSpacing": "calc(-1 * var(--s-1))", marginTop: "calc(-1 * var(--s3))"  } as React.CSSProperties}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="50%" className="centerh" viewBox="-50 -50 550 450">
        <defs>
          <style>{`.stroke{stroke:#000;stroke-width:5px}`}</style>
        </defs>
        <path className="stroke" fill={"none"} d={ELLIPSE_PATH} id="ellipsePath" />
        {nodes}
      </svg>
      <div className="horizontal-stack:s-1 centerh">
        <div className="clickable border padded:s-2" onClick={decCurrentStream}>
          {" "}
          prev{" "}
        </div>
        <div className="border padded:s-2" style={{ backgroundColor: ROOM_COLORS[currentStream] }}>
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

const LogoNode = ({ offset, myColor, showColor }: { offset: number , myColor: string, showColor: boolean}) => {
  return (
    <rect
      className="stroke"
      width="40"
      height="40"
      fill={showColor ? myColor : "#fff"}
      transform="rotate(45) translate(-20, -20)"
      key={`node-${offset}`}
    >
      <animateMotion dur="100s" begin={`${offset * 2}s`} repeatCount="indefinite" >
        <mpath xlinkHref="#ellipsePath" />
      </animateMotion>
    </rect>
  );
};

export default Logo;
