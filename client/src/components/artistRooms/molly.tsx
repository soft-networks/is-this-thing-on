import React from "react";

import { PopupStickerAdder } from "../interactive/stickerAdders";
import DefaultRoomView from "./defaultRoom";

const Molly: React.FC = () => {
  return (
    <div className="fullBleed relative">
      
      <a href="https://drive.google.com/drive/folders/1TMrAhtxdjJBs5ebf8rAYVXZ92rWf4ywz?usp=sharing" target="_blank">
        <img src="https://storage.googleapis.com/is-this-thing-on/molly/A_PRINTER.gif" className="everest cursor:link" style={{width: "10%", top: "5%", left: "5%", position: "absolute"}} />
      </a>
      <DefaultRoomView
      stickerChooser={PopupStickerAdder}
      chatStyle={
        {
          "--chatBorderColor": "hotpink",
          "--chatMessageColor": "var(--black)",
          "--chatAuthorColor": "black",
        } as React.CSSProperties
      }/>
    </div>
  );
};

export default Molly;
