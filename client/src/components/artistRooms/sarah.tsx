import React from "react";
import { EmptyChooser, PopupStickerAdder } from "../interactive/stickerAdders";
import DefaultRoom from "./defaultRoom";
import QuestionBox from "../interactive/custom/SarahQuestionBox";

const Sarah: React.FC = () => {
  return (
    <main className="fullBleed noOverflow relative">
      <DefaultRoom
        stickerChooser={EmptyChooser}
      />
      <QuestionBox/>
    </main>
  );
};

export default Sarah;
