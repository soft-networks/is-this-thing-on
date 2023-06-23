import React from "react";
import { PopupStickerAdder } from "../interactive/stickerAdders";
import DefaultRoomView from "./defaultRoom";

const Molly: React.FC = () => {
  return (
    <DefaultRoomView
      stickerChooser={PopupStickerAdder}
    />
  );
};

export default Molly;
