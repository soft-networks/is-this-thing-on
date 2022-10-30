import { Unsubscribe } from "firebase/firestore";
import { NextPage } from "next";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Layout from "../../layouts/layout";
import { syncWebRing } from "../../lib/firestore";
import useRingStore from "../../stores/ringStore";
import { useRoomStore } from "../../stores/roomStore";
import { SVGRingNode, SVGRingSeparate } from "../logo";
import VideoPlayer from "../videoPlayer";

const BigRingPage: NextPage = () => {
  const initializeRing = useRingStore(useCallback((s) => s.initializeRing, []));
  const updateRingStatus = useRingStore(useCallback((s) => s.updateStatus, []));
  const ringUnsubs = useRef<Unsubscribe[]>();
  const changeRoom = useRoomStore((s) => s.changeRoom);
  useEffect(() => {
    changeRoom(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    async function setupSync() {
      ringUnsubs.current = await syncWebRing(initializeRing, updateRingStatus);
    }
    setupSync();
    return () => ringUnsubs.current && ringUnsubs.current.forEach((u) => u());
  }, [initializeRing, updateRingStatus]);

  return (
    <Layout>
      <div className="fullBleed stack whiteFill">
        <div className="flex-1 contrastFill center-text" style={{ padding: "var(--s-2) 96px" } as React.CSSProperties}>
          <BigRing />
        </div>
        <div className="grow-text padded:s-2" style={{ paddingTop: 0 }}>
          Is this THING on? is a live streaming network for artists being built slowly over three seasons, guided by
          public performance and conversation. Season 1 is <span className="contrastFill">live most Sundays</span> at
          7PM ET. Learn more <Link href={"/about"}>here</Link>.
        </div>
      </div>
    </Layout>
  );
};

const ANIM_LENGTH = 1000;
const iframeSize = [160, 90];

const BigRing: React.FC = () => {
  const ring = useRingStore(useCallback((s) => s.links, []));
  const ringPieces: JSX.Element[] = useMemo(() => SVGRingSeparate({ ring: ring, returnWithoutWrapping: true }), [ring]);
  const router = useRouter();

  const ringNodes = useMemo(() => {
    const nodes: JSX.Element[] = [];
    const numKeys = Object.keys(ring).length;
    const ANIM_OFFSET = ANIM_LENGTH / numKeys;

    //iframeSize = iframeSize.map(s => s*0.75);
    Object.keys(ring).forEach((key, i) => {
      let iLink = ring[key];
      if (false) {
        nodes.push(
          <ExpandedSeasonZero iLink={iLink} ANIM_OFFSET={ANIM_OFFSET} router={router} i={i} key={`node-0-${i}`} />
        );
      } else {
        nodes.push(
          <ExpandedSeasonOne iLink={iLink} ANIM_OFFSET={ANIM_OFFSET} router={router} i={i} key={`node-1-${i}`} />
        );
      }
    });
    return nodes;
  }, [ring, router]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="fullWidth overflowVisible"
      style={{ maxWidth: "18000px" }}
      viewBox="-50 -50 550 450"
    >
      <text x={150} y={210} style={{ fontSize: "55px", fontStyle: "italic" }}>
        THING
      </text>
      {ringPieces[0]}
      {ringNodes}
    </svg>
  );
};

const ExpandedSeasonZero = ({
  iLink,
  ANIM_OFFSET,
  router,
  i,
}: {
  iLink: RoomLinkInfo;
  i: number;
  ANIM_OFFSET: number;
  router: NextRouter;
}) => {
  const src = iLink.season0URL; // `/streams/${iLink.roomID}`;
  if (iLink.streamStatus == "active" && src) {
    return (
      <g
        className="scale:hover"
        onClick={() => window.open(iLink.season0Href || src, "_blank")}
        style={{ cursor: "ne-resize" }}
        key={`node-visible-${i}`}
      >
        <animateMotion dur={`${ANIM_LENGTH}s`} begin={`${i * -ANIM_OFFSET}s`} repeatCount="indefinite">
          <mpath xlinkHref="#ellipsePath" />
        </animateMotion>
        <foreignObject
          width={iframeSize[0]}
          height={iframeSize[1]}
          transform={`translate(-${iframeSize[0] / 2}, -${iframeSize[1] / 2})`}
          style={{ border: "1px solid blue", filter: `drop-shadow(0px 0px 10px ${iLink.roomColor || "white"})` }}
        >
          <iframe
            src={src}
            width="100%"
            height="100%"
            frameBorder={0}
            className="noEvents noOverflow"
            allow="accelerometer; autoplay; modestbranding;"
            style={{ overflow: "hidden" }}
            scrolling="no"
          />
        </foreignObject>
        <text
          y={-iframeSize[1] / 2 - 5}
          textAnchor="middle"
          fill="blue"
          style={{ filter: `drop-shadow(0px 0px 6px ${iLink.roomColor || "white"})` }}
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
        showColor={false}
        key={`node-${i}`}
        ANIM_OFFSET={ANIM_OFFSET}
        selected={false}
        name={iLink.roomName}
      />
    );
  }
};

const ExpandedSeasonOne: React.FC<{
  iLink: RoomLinkInfo;
  i: number;
  ANIM_OFFSET: number;
  router: NextRouter;
}> = ({ iLink, ANIM_OFFSET, router, i }) => {
  const src = `/streams/${iLink.roomID}`;

  const [localMuted, setLocalMuted] = useState(true);

  if (iLink.streamStatus == "active" && src) {
    return (
      <g className="scale:hover showOnHoverTrigger" key={`node-visible-${i}`}>
        <animateMotion dur={`${ANIM_LENGTH}s`} begin={`${i * -ANIM_OFFSET}s`} repeatCount="indefinite">
          <mpath xlinkHref="#ellipsePath" />
        </animateMotion>
        <foreignObject
          width={iframeSize[0]}
          height={iframeSize[1]}
          transform={`translate(-${iframeSize[0] / 2}, -${iframeSize[1] / 2})`}
          style={{ border: "1px solid blue", filter: `drop-shadow(0px 0px 10px ${iLink.roomColor || "white"})`, cursor: 'ne-resize' }}
          onClick={() => router.push(src)}
        >
          <VideoPlayer className="fullBleed" streamPlaybackID={iLink.streamPlaybackID} muteOverride={localMuted}/>
        </foreignObject>
        <text
          y={-iframeSize[1] / 2 - 5}
          textAnchor="middle"
          fill="blue"
          style={{ filter: `drop-shadow(0px 0px 6px ${iLink.roomColor || "white"})`, cursor: 'ne-resize'}}
          onClick={() => router.push(src)} 

        >
          {iLink.roomName}
        </text>
        <AnimatedMuteButton muted={localMuted} onMuteChanged={setLocalMuted} />
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

const AnimatedMuteButton: React.FC<{ onMuteChanged: (newMute: boolean) => void; muted: boolean }> = ({
  onMuteChanged,
  muted,
}) => {
  const rectWidth = 75;
  return (
    <g transform={`translate(0, ${iframeSize[1]/2 + 10})`} onClick={() => onMuteChanged(!muted)} className="clickable showOnHover hoverTrigger">
      <rect width={rectWidth} height={20} fill={"white"} stroke={"black"} transform={`translate(-${rectWidth/2},-14)`} className="contrastFill:hover:triggered"></rect>
      <text textAnchor="middle" fill={"black"}> {muted ? "unmute" : "mute"} </text>
    </g>
  );
};
export default BigRingPage;
