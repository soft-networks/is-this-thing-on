import Draggable from "react-draggable";
import { useState } from "react";

const SoftMaintenanceLog: React.FC = () => {
  return (
    <AppWrapper
      appname="maintainance log"
      style={{ top: "var(--s0)", left: "43%" }}
    >
      <iframe
        src="https://docs.google.com/document/d/1m-g5SJLJdEuDKItA1SjtXZ7lT6QU1bjedLHFj_vIYDE/edit"
        style={{ width: "40vw", height: "65vh", minWidth: "800px", border: 0 }}
      ></iframe>
    </AppWrapper>
  );
};

const AppWrapper: React.FC<{
  appname: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ appname, children, className, style }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <Draggable handle=".handle">
      <div
        className={
          "stack:noGap border whiteFill absoluteOrigin noOverflow    " +
          className
        }
        style={style}
      >
        <div
          className="horizontal-stack:noGap contrastFill clickable "
          style={isOpen ? { borderBottom: "1px solid black" } : {}}
        >
          <div
            className="contrastFill:hover padded:s-3"
            onClick={() => setIsOpen(!isOpen)}
          >
            {" "}
            {isOpen ? "x" : "+"}
          </div>
          <div className="handle padded:s-3 flex-1 center-text">{appname}</div>
        </div>
        <div className="flex-1">{isOpen && children}</div>
      </div>
    </Draggable>
  );
};

export default SoftMaintenanceLog;
