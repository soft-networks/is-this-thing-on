import React from "react";
import { PopupStickerAdder } from "../stickerAdders";
import { RoomView } from "../room";
import QuestionBox from "../custom/SarahQuestionBox";

const Sarah: React.FC = () => {
  return (
    <div className="fullBleed noOverflow">
    <RoomView
      videoStyle={{
        width: "100%",
        height: "100%",
      }}
      videoContainerStyle={{ width: "100%", height: "100%", background: "#dcbdbb" }}
      stickerChooser={undefined}
    />
    <QuestionBox/>
    </div>
  );
};

export default Sarah;
