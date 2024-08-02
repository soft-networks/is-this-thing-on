import React from "react";

import AdminPanel from "../account/adminPanel";
import { Chat } from "../interactive/chat";
import {
  DefaultStickerAdder,
  EmptyChooser,
} from "../interactive/stickerAdders";
import Stickers from "../interactive/stickers";
import VideoPlayer from "../videoPlayer";

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
      <AdminPanel />
    </main>
  );
};

export default Maya;
