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
        </div>
        <div className="h3 stack">
          <p>NO-THING was on Dec 29 for 24hours, with 20+ streamers streaming together on the theme of nothing.</p>
          <p>It is now over. Enjoy looping archives of the streams.</p>
        </div>

        <div className="h1">
          <em>CLICK 2 ENTER</em>
        </div>
      </div>
    </div>
  );
};

export default ClickGate;
