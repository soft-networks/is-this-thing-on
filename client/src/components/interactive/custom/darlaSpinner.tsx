/* eslint-disable @next/next/no-img-element */

import { Unsubscribe } from "firebase/auth";
import { addDarlaStickers, resetNextSpinTime, syncSpin } from "../../../lib/firestore/custom/darlaSpinner";
import Countdown from "react-countdown";
import { useCallback, useEffect, useRef, useState } from "react";
import { logError, logInfo } from "../../../lib/logger";
import useStickerCDNStore from "../../../stores/stickerStore";
import { useUserStore } from "../../../stores/userStore";
import { useAdminStore } from "../../../stores/adminStore";
import Draggable from "react-draggable";


const Spinner: React.FC = () => {
  const [nextTime, setNextTime] = useState<number>();
  const [isIncomplete, setIsIncomplete] = useState<boolean>(nextTime ? nextTime > Date.now() : false);
  const [nextSpinLocation, setNextSpinLocation] = useState<number>(0);
  const [lastSpinWinner, setLastSpinWinner] = useState<string>();
  const unsub = useRef<Unsubscribe>();
  const stickerIDs = useStickerCDNStore(useCallback(s => s.stickerCDN ? Object.keys(s.stickerCDN) : undefined, []))
  const activeUsername = useUserStore(useCallback(s => s.displayName, []));
  const isAdmin = useAdminStore(useCallback((s) => s.isAdmin, []));

  const spinHappened = useCallback((nextTime: number, nextSpinAmount: number, lastWinner: string) => {
    setNextTime(nextTime);
    setIsIncomplete(true);
    setLastSpinWinner(lastWinner);
    logInfo("Next spin for Darla's room");
    setNextSpinLocation(nextSpinAmount);
  }, []);
  useEffect(() => {
    unsub.current = syncSpin(spinHappened);
    return () => {
      unsub.current?.();
    };
  }, [spinHappened]);
  const doSpin = useCallback(()=>{
    if (stickerIDs) {
      const randomStickerID = stickerIDs[Math.floor(Math.random() * stickerIDs.length)];
      addDarlaStickers(randomStickerID);
    } else {
      logError("Couldn't load Darla stickers, adding pie");
      addDarlaStickers("pie");
    }
    resetNextSpinTime(activeUsername);
  }, [])
  return (
    <>
      <Draggable disabled={!isAdmin} >
        <div className="uiLayer" style={{ position: "absolute", bottom: "200px", right: "20px", width: "20%" }}>
          <img
            src="https://www.pngall.com/wp-content/uploads/10/Spinning-Wheel-PNG-Images-HD.png"
            alt="Spinning wheel"
            className="animateTransform noEvents"
            style={{ transform: `rotate(${Math.floor((nextSpinLocation || 0) * 360)}deg)`, width: "100%", height: "auto" }}
          />
        </div>
      </Draggable>
      <div style={{ position: "absolute", left: "50%", top: "var(--s-1)" , transform: "translate(-50%, 0)"}}>
        {isIncomplete ? (
          <div className="uiLayer padded whiteFill noEvents">
            
            <div
              className=" caption contrastFill"
              style={{ position:"absolute", bottom: "calc(0* var(--s0)", left: "calc(-1 * var(--s0)" }}
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
          <div className="padded:s-2 contrastFill clickable contrastFill:hover border" onClick={() => doSpin()}>
            spin the wheel!!!
          </div>
        )}
      </div>
    </>
  );
};

export default Spinner;