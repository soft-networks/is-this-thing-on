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
    <div className="fullBleed contrastFill relative">
      <div
        id="desktopMessage"
        className="h1 center:absolute uiLayer center-text"
      >
        WELCOME TO THING.TUBE
        <br />
        CLICK 2 ENTER
      </div>
    </div>
  );
};

export default ClickGate;
