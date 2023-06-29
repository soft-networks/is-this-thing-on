import React, { useMemo } from "react";
import DefaultRoomview from "./defaultRoom";
import { CompromisedStickerAdder } from "../interactive/custom/compromisedStickerAdder";

const Compromised: React.FC = () => {
  return (
    <main className="fullBleed noOverflow relative" style={{ background: "black" }}>
      <DefaultRoomview
        stickerChooser={CompromisedStickerAdder}
        chatStyle={{
          left: "37%",
          top: "30%",
          transform: "translate(-50%, 0%)"
        } as React.CSSProperties}
      />
    </main>
  );
};

export default Compromised;
