import React, { useMemo } from "react";
import DefaultRoomview from "./defaultRoom";
import { CompromisedStickerAdder } from "../interactive/custom/compromisedStickerAdder";

const Compromised: React.FC = () => {
  return (
    <div className="fullBleed overflowScroll" style={{ background: "black" }}>
      <DefaultRoomview
        stickerChooser={CompromisedStickerAdder}
        chatStyle={{
          left: "37%",
          top: "30%",
          transform: "translate(-50%, 0%)"
        } as React.CSSProperties}
      />
    </div>
  );
};

export default Compromised;
