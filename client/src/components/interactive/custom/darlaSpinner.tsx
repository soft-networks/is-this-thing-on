/* eslint-disable @next/next/no-img-element */

import { Unsubscribe } from "firebase/auth";
import {
  addDarlaStickers,
  resetNextSpinTime,
  syncSpin,
} from "../../../lib/firestore/custom/darlaSpinner";
import Countdown from "react-countdown";
import { useCallback, useEffect, useRef, useState } from "react";
import { logError, logInfo } from "../../../lib/logger";
import useStickerCDNStore from "../../../stores/stickerStore";
import { useUserStore } from "../../../stores/userStore";
import { useAdminStore } from "../../../stores/adminStore";
import Draggable from "react-draggable";

const Spinner: React.FC = () => {
  const [nextTime, setNextTime] = useState<number>();
  const [isIncomplete, setIsIncomplete] = useState<boolean>(
    nextTime ? nextTime > Date.now() : false
  );
  const [nextSpinLocation, setNextSpinLocation] = useState<number>(0);
  const [lastSpinWinner, setLastSpinWinner] = useState<string>();
  const unsub = useRef<Unsubscribe>();

  const stickerCDN = useStickerCDNStore(useCallback((s) => s.stickerCDN, []));
  const activeUsername = useUserStore(useCallback((s) => s.displayName, []));
  const isAdmin = useAdminStore(useCallback((s) => s.isAdmin, []));

  const spinHappened = useCallback(
    (nextTime: number, nextSpinAmount: number, lastWinner: string) => {
      setNextTime(nextTime);
      setIsIncomplete(true);
      setLastSpinWinner(lastWinner);
      logInfo("Next spin for Darla's room");
      setNextSpinLocation(nextSpinAmount);
    },
    []
  );
  useEffect(() => {
    unsub.current = syncSpin(spinHappened);
    return () => {
      unsub.current?.();
    };
  }, [spinHappened]);
  const doSpin = useCallback(() => {
    if (stickerCDN) {
      const stickerIDs = Object.keys(stickerCDN);
      const randomStickerID =
        stickerIDs[Math.floor(Math.random() * stickerIDs.length)];
      addDarlaStickers(randomStickerID, stickerCDN[randomStickerID].size);
    } else {
      logError("Couldn't load Darla stickers");
    }
    resetNextSpinTime(activeUsername);
  }, []);
  return (
    <>
      <div
        className="uiLayer"
        style={{
          position: "absolute",
          bottom: "300px",
          right: "20px",
          width: "20vw",
        }}
      >
        <img
          src="https://storage.googleapis.com/is-this-thing-on/darla/spinback.png"
          style={{ position: "absolute", top: "-2vw", width: "100%", zIndex: -1}}
        ></img>
        <img
          src="https://storage.googleapis.com/is-this-thing-on/darla/spinfront.png"
          alt="Spinning wheel"
          className="animateTransform noEvents"
          style={{
            transform: `rotate(${Math.floor(
              (nextSpinLocation || 0) * 360
            )}deg)`,
            width: "100%",
            height: "auto",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "var(--s-1)",
          transform: "translate(-50%, 0)",
        }}
      >
        {isIncomplete ? (
          <div className="uiLayer padded whiteFill noEvents">
            <div
              className=" caption contrastFill"
              style={{
                position: "absolute",
                bottom: "calc(0* var(--s0)",
                left: "calc(-1 * var(--s0)",
              }}
            >
              last spin: {lastSpinWinner}
            </div>
            <Countdown
              date={nextTime}
              intervalDelay={0}
              onComplete={() => setIsIncomplete(false)}
              renderer={(props) => (
                <div>
                  {props.minutes} min {props.seconds} seconds
                </div>
              )}
            />
          </div>
        ) : (
          <div
            className="padded:s-2 contrastFill clickable contrastFill:hover border"
            onClick={() => doSpin()}
          >
            spin the wheel!!!
          </div>
        )}
      </div>
    </>
  );
};

export default Spinner;
