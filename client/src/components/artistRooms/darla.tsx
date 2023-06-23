/* eslint-disable @next/next/no-img-element */
import React from "react";
import DefaultRoom from "./defaultRoom";
import { EmptyChooser } from "../interactive/stickerAdders";
import Spinner from "../interactive/custom/darlaSpinner";

const Darla: React.FC = () => {
  return (
    <div className="fullBleed noOverflow relative">
      <DefaultRoom
        stickerChooser={EmptyChooser}
      />
      <Spinner />
    </div>
  );
};

export default Darla;
