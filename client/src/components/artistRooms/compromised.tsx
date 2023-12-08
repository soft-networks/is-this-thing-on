import React, { useMemo } from "react";
import DefaultRoom from "./defaultRoom";
import { CompromisedStickerAdder } from "../interactive/custom/compromisedStickerAdder";

const Compromised: React.FC = () => {
  return (
    <main className="fullBleed noOverflow relative" style={{ background: "black" }}>
      <DefaultRoom
        stickerChooser={CompromisedStickerAdder}
      />
    </main>
  );
};

export default Compromised;
