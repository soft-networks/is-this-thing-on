import React from "react";
import { EmptyChooser, PopupStickerAdder } from "../interactive/stickerAdders";
import DefaultRoomView from "./defaultRoom";
import QuestionBox from "../interactive/custom/SarahQuestionBox";

const Sarah: React.FC = () => {
  return (
    <div className="fullBleed noOverflow">
    <DefaultRoomView
      videoStyle={{
        width: "100%",
        height: "100%",
      }}
      videoContainerStyle={{ width: "100%", height: "100%", background: "#dcbdbb" }}
      stickerChooser={EmptyChooser}
    />
    <QuestionBox/>
    </div>
  );
};

export default Sarah;
