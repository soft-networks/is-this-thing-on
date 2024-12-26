import { useCallback, useEffect, useState } from "react";

const ClickGate: React.FunctionComponent = ({ children }) => {
  const [didClick, setDidClick] = useState(false);

  const clickHappened = useCallback(() => {
    setDidClick(true);
  }, [setDidClick]);
  useEffect(() => {
    //Set event listener on window
    window.addEventListener("click", clickHappened);
  }, [clickHappened]);

  return didClick ? (
    <>{children}</>
  ) : (
    <div className="fullBleed contrastFill relative ">
      <div
        id="desktopMessage"
        className="center:absolute uiLayer center-text padded narrow stack:s2 cursor:pointer"
      >
        <div className="h1">
          WELCOME TO NO-THING<br />
          a live stream about NOTHING
        </div>
        <div className="h3 stack">
          <p>on Dec 29 for 24hours, 20+ streamers are streaming together on the theme about nothing.</p>
          <p>at 3pm and 11pm ET, we will have a chat party. <br/>come back then for a busier thing or hang out whenever for a lot of nothing
          </p>
          <p>
            THING.tube features a universal chat where you can talk across rooms, and each room has it's own chat. please be nice. if you're being a jerk or a troll, we will probably kick you out. also, some streams are NSFW, so view at your own discretion.
          </p>
        </div>

        <div className="h1">
          <em>CLICK 2 ENTER</em>
        </div>
      </div>
    </div>
  );
};

export default ClickGate;
