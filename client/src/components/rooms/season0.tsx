import { Unsubscribe } from "firebase/firestore";
import { NextPage } from "next";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { syncWebRing } from "../../lib/firestore";
import useRingStore from "../../stores/ringStore";
import { SVGRingNode, SVGRingSeparate } from "../logo";
import VideoPlayer from "../videoPlayer";

const Season0Home: NextPage = () => {
  const initializeRing = useRingStore(useCallback((s) => s.initializeRing, []));
  const updateRingStatus = useRingStore(useCallback((s) => s.updateStatus, []));
  const ringUnsubs = useRef<Unsubscribe[]>();

  useEffect(() => {
    async function setupSync() {
      ringUnsubs.current = await syncWebRing(initializeRing, updateRingStatus);
    }
    setupSync();
    return () => ringUnsubs.current && ringUnsubs.current.forEach((u) => u());
  }, [initializeRing, updateRingStatus]);

  return (
    <div className="fullBleed stack">
      <div className="flex-1 contrastFill center-text" style={{ padding: "72px 96px"} as React.CSSProperties} >
        <Season0Ring />
      </div>
      <div className="grow-text padded:s-2" style={{paddingTop: 0}}>
        Is this THING on? is a live streaming network for artists being built slowly over three seasons, guided by public performance and conversation. Season 0 is{" "}
        <span className="contrastFill">LIVE TODAY</span> with performances at 7PM ET and{" "}
        <a href="https://nyu.zoom.us/j/96229850527" target="_blank" rel="noreferrer">
          salon
        </a>{" "}
        at 8PM ET. Learn more <Link href={"/about"}>here</Link>.
      </div>
    </div>
  );
};

const Season0Ring: React.FC = () => {
  const ANIM_LENGTH = 1000;
  const ring = useRingStore(useCallback((s) => s.links, []));
  const ringPieces: JSX.Element[] = useMemo(() => SVGRingSeparate({ ring: ring, returnWithoutWrapping: true }), [ring]);

  const ringNodes = useMemo(() => {
    const nodes: JSX.Element[] = [];
    const numKeys = Object.keys(ring).length;
    const ANIM_OFFSET = ANIM_LENGTH / numKeys;
    let iframeSize = [160, 90];
    //iframeSize = iframeSize.map(s => s*0.75);
    Object.keys(ring).forEach((key, i) => {
      let iLink = ring[key];
      const src = iLink.season0URL;
      if (key == "molly")
        console.log("Setting up ....", iLink);
      if (iLink.streamStatus == "active" && src) {
        nodes.push(
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
              style={{ border: "2px solid blue", filter: `drop-shadow(0px 0px 10px ${iLink.roomColor || "white"})` }}
              onClick={() => window.open(src, "_blank")}
            >
              <iframe
                src={src}
                width="100%"
                height="100%"
                frameBorder={0}
                className="noEvents noOverflow"
                allow="accelerometer; autoplay; modestbranding;"
                style={{overflow: "hidden"}}
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
        nodes.push(
          <SVGRingNode
            index={i}
            myColor={iLink.roomColor}
            ANIM_LENGTH={ANIM_LENGTH}
            showColor={false}
            key={`node-${i}`}
            ANIM_OFFSET={ANIM_OFFSET}
            selected={false}
          />
        );
      }
    });
    return nodes;
  }, [ring]);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="fullWidth overflowVisible" style={{maxWidth: "18000px"}} viewBox="-50 -50 550 450">
      <text x={150} y={210} style={{ fontSize: "55px", fontStyle: "italic" }}>
        THING
      </text>
      {ringPieces[0]}
      {ringNodes}
    </svg>
  );
};

export default Season0Home;
