import React from "react";
import { PopupStickerAdder } from "../interactive/stickerAdders";
import DefaultRoomView from "./defaultRoom";

const Molly: React.FC = () => {
  return (
    <DefaultRoomView
      videoStyle={{
        width: "100%",
        height: "100%",
      }}
      videoContainerStyle={{ width: "100%", height: "100%", background: "#dcbdbb" }}
      stickerChooser={PopupStickerAdder}
    />
  );
};

export default Molly;
