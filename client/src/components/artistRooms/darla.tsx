/* eslint-disable @next/next/no-img-element */
import React from "react";

import Spinner from "../interactive/custom/darlaSpinner";
import { EmptyChooser } from "../interactive/stickerAdders";
import DefaultRoom from "./defaultRoom";

const Darla: React.FC = () => {
  return (
    <main className="fullBleed noOverflow relative">
      <DefaultRoom stickerChooser={EmptyChooser} />
      <Spinner />
    </main>
  );
};

export default Darla;
