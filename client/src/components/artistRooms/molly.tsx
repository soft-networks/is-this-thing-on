import React from "react";

import { PopupStickerAdder } from "../interactive/stickerAdders";
import DefaultRoomView from "./defaultRoom";

const Molly: React.FC = () => {
  return (
    <DefaultRoomView
      stickerChooser={PopupStickerAdder}
      chatStyle={
        {
          "--chatBorderColor": "hotpink",
          "--chatMessageColor": "var(--black)",
          "--chatAuthorColor": "black",
        } as React.CSSProperties
      }
    />
  );
};

export default Molly;
