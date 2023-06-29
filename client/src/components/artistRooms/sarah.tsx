import React from "react";
import { EmptyChooser, PopupStickerAdder } from "../interactive/stickerAdders";
import DefaultRoomView from "./defaultRoom";
import QuestionBox from "../interactive/custom/SarahQuestionBox";

const Sarah: React.FC = () => {
  return (
    <main className="fullBleed noOverflow relative">
      <DefaultRoomView
        stickerChooser={EmptyChooser}
      />
      <QuestionBox/>
    </main>
  );
};

export default Sarah;
