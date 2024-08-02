import React, { useMemo } from "react";

import { CompromisedStickerAdder } from "../interactive/custom/compromisedStickerAdder";
import DefaultRoom from "./defaultRoom";

const Compromised: React.FC = () => {
  return (
    <main
      className="fullBleed noOverflow relative"
      style={{ background: "black" }}
    >
      <DefaultRoom stickerChooser={CompromisedStickerAdder} />
    </main>
  );
};

export default Compromised;
