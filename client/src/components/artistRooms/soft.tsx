import React, { useMemo, useState } from "react";
import DefaultRoomview from "./defaultRoom";
import Draggable from "react-draggable";
import VideoPlayer from "../videoPlayer";
import { Chat } from "../interactive/chat";

const Soft: React.FC = () => {
  return (
    <main
      className="fullBleed noOverflow relative"
      style={{ background: "#edf3f4" }}
    >
      <VideoPlayer />
      <Chat />
      <AppWrapper
        appname="preview website"
        style={{left: "40%", top: "5%" }}
      >
        <iframe
          src="https://livecode--is-this-thing-on.netlify.app/"
          style={{ width: "50vw", height: "50vh", border: 0 }}
          title="soft-networks/is-this-thing-on/draft/staging-cookies preview"
          allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
          sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        />
      </AppWrapper>
      <AppWrapper
        appname="maintainance log"
        style={{top: "30%", left: "55%" }}
      >
        <iframe
          src="https://docs.google.com/document/d/1m-g5SJLJdEuDKItA1SjtXZ7lT6QU1bjedLHFj_vIYDE/edit"
          style={{ width: "40vw", height: "65vh", border: 0 }}
        ></iframe>
      </AppWrapper>
    </main>
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
        className={"stack:noGap border whiteFill absoluteOrigin noOverflow    " + className}
        style={style}
      >
        <div
          className="horizontal-stack:noGap contrastFill clickable "
          style={isOpen ? { borderBottom: "1px solid black" } : {}}
        > 
          <div className="contrastFill:hover padded:s-3" onClick={() => setIsOpen(!isOpen)}> {isOpen ? "x" : "+"}</div>
          <div className="handle padded:s-3 flex-1 center-text">{appname}</div>
        </div>
        <div className="flex-1">{isOpen && children}</div>
      </div>
    </Draggable>
  );
};

export default Soft;
