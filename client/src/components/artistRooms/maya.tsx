import {
  DefaultStickerAdder,
  EmptyChooser,
} from "../interactive/stickerAdders";

import { Chat } from "../interactive/chat";
import React from "react";
import Stickers from "../interactive/stickers";
import VideoPlayer from "../video/videoPlayer";

const Maya: React.FC = () => {
  return (
    <main
      className="fullBleed noOverflow relative"
      style={
        { background: "pink", "--stickerSize": "10%" } as React.CSSProperties
      }
    >
      <Chat key="chat" />
      <VideoPlayer />
      <Stickers StickerChooser={DefaultStickerAdder} />
    </main>
  );
};

export default Maya;
