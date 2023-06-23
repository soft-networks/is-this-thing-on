/* eslint-disable @next/next/no-img-element */
import { NextRouter, useRouter } from "next/router";
import useRingStore, { roomIDToHREF } from "../../stores/ringStore";
import MuxPlayer from "@mux/mux-player-react";
import { useCallback, useMemo, useState }from "react";
import { SVGRingNode, SVGRingSeparate } from "./svg";
import VideoPreview from "../videoPreview";


const iframeSize = [160, 90];

const ANIM_LENGTH = 1000;

const BigRing: React.FC = () => {
  const ring = useRingStore(useCallback((s) => s.links, []));
  const ringPieces: JSX.Element[] = useMemo(() => SVGRingSeparate({ ring: ring, returnWithoutWrapping: true }), [ring]);
  const router = useRouter();
  const ringNodes = useMemo(() => {
    const nodes: JSX.Element[] = [];
    const numKeys = Object.keys(ring).length;
    const ANIM_OFFSET = ANIM_LENGTH / numKeys;
    Object.keys(ring).forEach((key, i) => {
      let iLink = ring[key];
        nodes.push(
          <BigRingNode iLink={iLink} ANIM_OFFSET={ANIM_OFFSET} router={router} i={i} key={`node-1-${i}`}  ANIM_LENGTH={ANIM_LENGTH}/>
        );
    });
    return nodes;
  }, [ring, router]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className=" overflowVisible"
      style={{ width: "90%", maxWidth: "18000px" }}
      viewBox="-50 -50 550 450"
    >
      <text x={150} y={210} style={{ fontSize: "55px", fontStyle: "italic" }} fill="black">
        THING
      </text>
      {ringPieces[0]}
      {ringNodes}
    </svg>
  );
};



const BigRingNode: React.FC<{
  iLink: RoomLinkInfo;
  i: number;
  ANIM_OFFSET: number;
  ANIM_LENGTH: number;
  router: NextRouter;
}> = ({ iLink, ANIM_OFFSET, ANIM_LENGTH, router, i }) => {
  const src = roomIDToHREF(iLink.roomID);

  const [localMuted, setLocalMuted] = useState(true);

  if (iLink.streamStatus == "active" && src) {
    return (
      <g
        className="scale:hover showOnHoverTrigger"
        key={`node-visible-${i}`}
        onMouseOut={() => setLocalMuted(false)}
        onMouseEnter={() => setLocalMuted(true)}
      >
        <animateMotion dur={`${ANIM_LENGTH}s`} begin={`${i * -ANIM_OFFSET}s`} repeatCount="indefinite">
          <mpath xlinkHref="#ellipsePath" />
        </animateMotion>
        <foreignObject
          width={iframeSize[0]}
          height={iframeSize[1]}
          transform={`translate(-${iframeSize[0] / 2}, -${iframeSize[1] / 2})`}
          style={{
            border: "1px solid blue",
            filter: `drop-shadow(0px 0px 10px ${iLink.roomColor || "white"})`,
            cursor: "ne-resize",
          }}
          onClick={() => router.push(src)}
        >
          {iLink.roomName == "molly" && (
            <img
              src="https://storage.googleapis.com/is-this-thing-on/Molly_PNG_Overlay.png"
              alt="molly video overlay"
              className="fullBleed"
            />
          )}
          <VideoPreview iLink={iLink} localMuted={localMuted} />
        </foreignObject>
        <text
          y={-iframeSize[1] / 2 - 5}
          textAnchor="middle"
          fill="blue"
          style={{ filter: `drop-shadow(0px 0px 6px ${iLink.roomColor || "white"})`, cursor: "ne-resize" }}
          onClick={() => router.push(src)}
        >
          {iLink.roomName}
        </text>
      </g>
    );
  } else {
    return (
      <SVGRingNode
        index={i}
        myColor={iLink.roomColor}
        ANIM_LENGTH={ANIM_LENGTH}
        showColor={true}
        key={`node-${i}`}
        ANIM_OFFSET={ANIM_OFFSET}
        selected={false}
        name={iLink.roomName}
        hoverBehavior={true}
        onClick={() => router.push(src)}
      />
    );
  }
};

export default BigRing;