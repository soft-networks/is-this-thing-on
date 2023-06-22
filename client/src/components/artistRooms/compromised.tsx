import React, { useMemo } from "react";
import DefaultRoomview from "./defaultRoom";
import { CompromisedStickerAdder } from "../interactive/custom/compromisedStickerAdder";

const Compromised: React.FC = () => {
  return (
    <div className="fullBleed overflowScroll" style={{ background: "black" }}>
      <DefaultRoomview
        videoStyle={{
          width: "100%",
          height: "100%",
        }}
        stickerChooser={CompromisedStickerAdder}
      />
    </div>
  );
};

export default Compromised;
