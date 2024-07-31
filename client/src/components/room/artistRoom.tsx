import {
  EmptyChooser,
  PopupStickerAdder,
  StickerAdderProps,
} from "../interactive/stickerAdders";

import AdminPanel from "../account/adminPanel";
import { Chat } from "../interactive/chat";
import ChrisyStickers from "../interactive/custom/chrisyStickers";
import SoftMaintenanceLog from "../interactive/custom/softMaintenanceLog";
import Stickers from "../interactive/stickers";
import VideoPlayer from "../videoPlayer";

type RoomProperties = {
  // CSS properties for main wrapper
  classes?: string;
  styles?: ThingCSSProperties;

  // Sticker customization
  customStickers?: () => JSX.Element;
  stickerStyle?: ThingCSSProperties;
  stickerChooser?: React.FC<StickerAdderProps>;

  // Chat customization
  chatStyle?: ThingCSSProperties;

  // Extra fancy custom children
  children?: () => JSX.Element;
};

const Chrisy: RoomProperties = {
  classes: "chrisyRoom",
  styles: {
    "--stickerGlowShadow": "none",
  },
  customStickers: () => <ChrisyStickers />,
  chatStyle: {
    "--chatBorderColor": "rgba(0,0,0,0.1)",
    "--chatMessageColor": "var(--black)",
    "--chatAuthorColor": "magenta",
  },
};

const Molly: RoomProperties = {
  stickerChooser: PopupStickerAdder,
  chatStyle: {
    "--chatBorderColor": "hotpink",
    "--chatMessageColor": "var(--black)",
    "--chatAuthorColor": "black",
  },
};

const Sarah: RoomProperties = {
  stickerChooser: EmptyChooser,
};

const Soft: RoomProperties = {
  styles: {
    background: "#edf3f4",
  },
  customStickers: () => <></>,
  children: () => <SoftMaintenanceLog />,
};

const ROOMS: { [key: string]: RoomProperties } = {
  chrisy: Chrisy,
  molly: Molly,
  sarah: Sarah,
  soft: Soft,
};

const ArtistRoom = ({ roomID }: { roomID: string }) => {
  const room = ROOMS[roomID] || {};
  const stickers = room.customStickers ? (
    room.customStickers()
  ) : (
    <Stickers style={room.stickerStyle} StickerChooser={room.stickerChooser} />
  );

  return (
    <main
      className={`fullBleed noOverflow relative ${room.classes}`}
      style={room.styles}
    >
      <Chat key="chat" style={room.chatStyle} />
      <VideoPlayer />
      {stickers}
      <AdminPanel />
      {room.children && room.children()}
    </main>
  );
};

export default ArtistRoom;
