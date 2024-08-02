/* eslint-disable @next/next/no-img-element */
import { NextRouter, useRouter } from "next/router";
import useRingStore, { roomIDToHREF } from "../../stores/ringStore";
import MuxPlayer from "@mux/mux-player-react";
import { useCallback, useMemo, useState } from "react";
import { SVGRingNode, SVGRingSeparate } from "./svg";
import VideoPreview from "../videoPreview";
import { roomIsActive } from "../../stores/roomStore";

const iframeSize = [160, 90];

const ANIM_LENGTH = 1000;

const BigRing: React.FC = () => {
  const ring = useRingStore(useCallback((s) => s.links, []));
  const ringForeground: JSX.Element = useMemo(
    () => SVGRingSeparate({ ring: ring, returnWithoutWrapping: true })[0],
    [ring],
  );
  const ringNodes = useMemo(() => {
    const nodes: JSX.Element[] = [];
    const numKeys = Object.keys(ring).length;
    const ANIM_OFFSET = ANIM_LENGTH / numKeys;
    Object.keys(ring).forEach((key, i) => {
      const roomLinkDetails = ring[key];
      nodes.push(
        <BigRingNode
          roomLinkDetails={roomLinkDetails}
          ANIM_OFFSET={ANIM_OFFSET}
          i={i}
          key={`bigringnode-${i}`}
          ANIM_LENGTH={ANIM_LENGTH}
        />,
      );
    });
    return nodes;
  }, [ring]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className=" overflowVisible"
      style={{ width: "70%", maxWidth: "18000px" }}
      viewBox="-50 -50 550 450"
    >
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
  const src = useMemo(
    () => roomIDToHREF(roomLinkDetails.roomID),
    [roomLinkDetails.roomID],
  );
  const router = useRouter();
  const [localMuted, setLocalMuted] = useState(true);
  if (roomIsActive(roomLinkDetails) && src) {
    return (
      <g
        className="scale:hover showOnHoverTrigger"
        key={`node-visible-${i}`}
        onMouseOut={() => setLocalMuted(true)}
        onMouseEnter={() => setLocalMuted(false)}
      >
        <animateMotion
          dur={`${ANIM_LENGTH}s`}
          begin={`${i * -ANIM_OFFSET}s`}
          repeatCount="indefinite"
        >
          <mpath xlinkHref="#ellipsePath" />
        </animateMotion>
        <foreignObject
          width={iframeSize[0]}
          height={iframeSize[1]}
          transform={`translate(-${iframeSize[0] / 2}, -${iframeSize[1] / 2})`}
          style={{
            border: "1px solid black",
            filter: `drop-shadow(0px 0px 10px ${roomLinkDetails.roomColor || "white"})`,
            cursor: "ne-resize",
          }}
          vectorEffect="non-scaling-stroke"
          onClick={() => router.push(src)}
        >
          {roomLinkDetails.roomName == "molly" && (
            <img
              src="https://storage.googleapis.com/is-this-thing-on/Molly_PNG_Overlay.png"
              alt="molly video overlay"
              className="fullBleed"
            />
          )}
          <VideoPreview
            iLink={roomLinkDetails}
            localMuted={localMuted}
            isTest={roomLinkDetails.streamStatus.includes("test")}
          />
        </foreignObject>
        <text
          y={-iframeSize[1] / 2 - 5}
          textAnchor="middle"
          fill="blue"
          style={{
            filter: `drop-shadow(0px 0px 6px ${roomLinkDetails.roomColor || "white"})`,
            cursor: "ne-resize",
          }}
          onClick={() => router.push(src)}
        >
          {roomLinkDetails.roomName}
        </text>
      </g>
    );
  } else {
    return (
      null && (
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
      )
    );
  }
};

export default BigRing;
