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
        appname="website"
        style={{ width: "30%", height: "40%", left: "2%", top: "5%" }}
      >
        <iframe
          src="https://codesandbox.io/p/github/soft-networks/is-this-thing-on/draft/staging-cookies?view=editor&hidesidebar=1"
          style={{ width: "100%", height: "100%", border: 0 }}
          title="soft-networks/is-this-thing-on/draft/staging-cookies"
          allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
          sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        ></iframe>
      </AppWrapper>
      <AppWrapper
        appname="dev website"
        style={{ width: "40%", height: "40%", top: "10%", left: "25%" }}
      >
        <iframe
          src="https://7pg39n-3000.csb.app/"
          style={{ width: "100%", height: "100%", border: 0 }}
          title="soft-networks/is-this-thing-on/draft/staging-cookies preview"
          allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
          sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        />
      </AppWrapper>
      <AppWrapper
        appname="requests"
        style={{ width: "40%", height: "65%", top: "30%", left: "55%" }}
      >
        <iframe
          src="https://docs.google.com/document/d/1m-g5SJLJdEuDKItA1SjtXZ7lT6QU1bjedLHFj_vIYDE/edit"
          style={{ width: "100%", height: "100%", border: 0 }}
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
        className={"stack:noGap border whiteFill absoluteOrigin  " + className}
        style={style}
      >
        <div
          className="horizontal-stack:noGap contrastFill clickable "
          style={{ borderBottom: "1px solid black" }}
        >
          <div className="handle padded:s-3 flex-1 center-text">{appname}</div>
        </div>
        <div className="flex-1">{isOpen && children}</div>
      </div>
    </Draggable>
  );
};

export default Soft;
