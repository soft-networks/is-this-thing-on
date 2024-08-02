import React from "react";
import VideoPlayer from "../videoPlayer";
import Stickers from "../interactive/stickers";
import {
  DefaultStickerAdder,
  EmptyChooser,
} from "../interactive/stickerAdders";
import { Chat } from "../interactive/chat";
import AdminPanel from "../account/adminPanel";

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
