/* eslint-disable @next/next/no-img-element */

import { Unsubscribe } from "firebase/auth";
import { resetNextSpinTime, syncSpin } from "../../../lib/firestore/custom/darlaSpinner";
import Countdown from "react-countdown";
import { useCallback, useEffect, useRef, useState } from "react";


const Spinner: React.FC = () => {
  const [nextTime, setNextTime] = useState<number>();
  const [isIncomplete, setIsIncomplete] = useState<boolean>(nextTime ? nextTime > Date.now() : false);
  const [nextSpinAmount, setNextSpinAmount] = useState<number>(0);
  const unsub = useRef<Unsubscribe>();
  const spinHappened = useCallback((nextTime: number, nextSpinAmount: number) => {
    setNextTime(nextTime);
    setIsIncomplete(true);
    console.log("nextSpi");
    setNextSpinAmount(nextSpinAmount);
  }, []);
  useEffect(() => {
    unsub.current = syncSpin(spinHappened);
    return () => {
      unsub.current?.();
    };
  }, [spinHappened]);

  return (
    <>
      <div className="highest" style={{ position: "absolute", bottom: "200px", right: "20px", width: "20%" }}>
        <img
          src="https://www.pngall.com/wp-content/uploads/10/Spinning-Wheel-PNG-Images-HD.png"
          alt="Spinning wheel"
          className="animateTransform noEvents"
          style={{ transform: `rotate(${Math.floor((nextSpinAmount || 0) * 360)}deg)`, width: "100%", height: "auto" }}
        />
      </div>
      <div style={{ position: "absolute", bottom: "96px", right: "var(--s2)" }}>
        {isIncomplete ? (
          <div className="high padded whiteFill noEvents">
            <div
              className="absoluteOrigin caption contrastFill"
              style={{ top: "calc(-1* var(--s0)", left: "calc(-1 * var(--s0)" }}
            >
              next spin in...
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
          <div className="padded contrastFill clickable contrastFill:hover" onClick={() => resetNextSpinTime()}>
            spin the wheel!!!
          </div>
        )}
      </div>
    </>
  );
};

export default Spinner;