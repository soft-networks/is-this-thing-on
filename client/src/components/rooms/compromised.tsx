import React, { useMemo } from "react";
import { Chat } from "../chat";
import VideoPlayer from "../videoPlayer";
import Stickers from "../stickers";
import Ring from "../ring";
import { RoomView } from "../room";
import { CompromisedStickerAdder } from "../custom/compromisedStickerAdder";

const Compromised: React.FC = () => {
  return (
    <div className="fullBleed overflowScroll" style={{ background: "black" }}>
      <RoomView
        videoStyle={{
          width: "100%",
          height: "100%",
        }}
        stickerChooser={CompromisedStickerAdder}
      />
    </div>
  );
};

export default Compromised;
