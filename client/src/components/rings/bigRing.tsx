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
  const ringForeground: JSX.Element = useMemo(() => SVGRingSeparate({ ring: ring, returnWithoutWrapping: true })[0], [ring]);
  const ringNodes = useMemo(() => {
    const nodes: JSX.Element[] = [];
    const numKeys = Object.keys(ring).length;
    const ANIM_OFFSET = ANIM_LENGTH / numKeys;
    Object.keys(ring).forEach((key, i) => {
      let roomLinkDetails = ring[key];
        nodes.push(
          <BigRingNode
            roomLinkDetails={roomLinkDetails}
            ANIM_OFFSET={ANIM_OFFSET}
            i={i}
            key={`bigringnode-${i}`}
            ANIM_LENGTH={ANIM_LENGTH}
          />
        );
    });
    return nodes;
  }, [ring]);

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
      {ringForeground}
      {ringNodes}
    </svg>
  );
};

const BigRingNode: React.FC<{
  roomLinkDetails: RoomLinkInfo;
  i: number;
  ANIM_OFFSET: number;
  ANIM_LENGTH: number;
}> = ({ roomLinkDetails, ANIM_OFFSET, ANIM_LENGTH, i }) => {
  const src = useMemo(() => roomIDToHREF(roomLinkDetails.roomID), [roomLinkDetails.roomID]);
  const router = useRouter();
  const [localMuted, setLocalMuted] = useState(true);
  if (roomLinkDetails.streamStatus == "active" && src) {
    return (
      <g
        className="scale:hover showOnHoverTrigger"
        key={`node-visible-${i}`}
        onMouseOut={() => setLocalMuted(true)}
        onMouseEnter={() => setLocalMuted(false)}
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
            filter: `drop-shadow(0px 0px 10px ${roomLinkDetails.roomColor || "white"})`,
            cursor: "ne-resize",
          }}
          onClick={() => router.push(src)}
        >
          {roomLinkDetails.roomName == "molly" && (
            <img
              src="https://storage.googleapis.com/is-this-thing-on/Molly_PNG_Overlay.png"
              alt="molly video overlay"
              className="fullBleed"
            />
          )}
          <VideoPreview iLink={roomLinkDetails} localMuted={localMuted} />
        </foreignObject>
        <text
          y={-iframeSize[1] / 2 - 5}
          textAnchor="middle"
          fill="blue"
          style={{ filter: `drop-shadow(0px 0px 6px ${roomLinkDetails.roomColor || "white"})`, cursor: "ne-resize" }}
          onClick={() => router.push(src)}
        >
          {roomLinkDetails.roomName}
        </text>
      </g>
    );
  } else {
    return (
      <SVGRingNode
        index={i}
        myColor={roomLinkDetails.roomColor}
        ANIM_LENGTH={ANIM_LENGTH}
        showColor={true}
        key={`node-${i}`}
        ANIM_OFFSET={ANIM_OFFSET}
        selected={false}
        name={roomLinkDetails.roomName}
        hoverBehavior={true}
        onClick={() => router.push(src)}
      />
    );
  }
};

export default BigRing;