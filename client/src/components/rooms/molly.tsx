import React from "react";
import { PopupStickerAdder } from "../stickerAdders";
import { RoomView } from "../room";

const Molly: React.FC = () => {
  return (
    <RoomView
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
