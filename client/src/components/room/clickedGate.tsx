import { useCallback, useEffect } from "react";
import useDidClick from "../../stores/clickedStore";

const ClickGate: React.FunctionComponent = ({ children }) => {
  const didClick = useDidClick(useCallback((s) => s.didClick, []));
  const setDidClick = useDidClick(useCallback((s) => s.setDidClick, []));
  
  const clickHappened = useCallback(() => { setDidClick(true); }, [setDidClick]);
  useEffect(() => {
    //Set event listener on window
    window.addEventListener("click", clickHappened);
  }, [clickHappened]);

  return didClick ? (
    <>{children}</>
  ) : (
    <div className="fullBleed contrastFill relative">
      <div className="h1 center:absolute uiLayer center-text">WELCOME TO THING. <br/> CLICK 2 ENTER</div>
    </div>
  );
}

export default ClickGate;