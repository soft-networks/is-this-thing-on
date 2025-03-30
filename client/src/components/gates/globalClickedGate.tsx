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
          WELCOME TO THING<br />
        </div>
        <div className="h3 stack">
          <p>THING is an artist powered live streaming network.</p>
          <p>Our next performance, THING+YOU is coming to the Museum of the Moving Image (MoMI) April 12th.</p>
        </div>
        <div className="h1">
          <em>CLICK 2 ENTER</em>
        </div>
      </div>
    </div>
  );
};

export default ClickGate;
