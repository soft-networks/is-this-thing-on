import React from "react";

import {
  EmptyChooser,
  PopupStickerAdder,
  TypingStickerAdder,
} from "../interactive/stickerAdders";
import DefaultRoom from "./defaultRoom";

const Sarah: React.FC = () => {
  return (
    <main className="fullBleed noOverflow relative">
      <DefaultRoom stickerChooser={EmptyChooser} />
    </main>
  );
};

export default Sarah;
