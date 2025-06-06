import { useCallback } from "react";
import useStickerCDNStore from "../../stores/stickerStore";
import { StickerImage } from "./stickerRenderHelpers";
import { addStickerInstance } from "../../lib/firestore";
import { useRoomStore } from "../../stores/currentRoomStore";

export const MobileStickerAdder: React.FC = ({
}) => {

  const cdn = useStickerCDNStore(useCallback((s) => s.stickerCDN, []));
  const roomID = useRoomStore(useCallback((s) => s.roomInfo?.roomID, []));
  
  const addSticker = (cdnID: string) => {
    if (!roomID || !cdn) return;
    const pos: Pos = [Math.random(), Math.random()];
    addStickerInstance(roomID, {
      position: pos,
      timestamp: Date.now(),
      cdnID: cdnID,
      size: cdn[cdnID].size || 0.1,
      zIndex: 1000,
    });
  }
  return cdn ? <MobileStickerTypeChooser cdn={cdn} typeSelected={(id?: string) => {id && addSticker(id)}} /> : null;;
};

const MobileStickerTypeChooser: React.FC<{
  cdn: StickerCDN;
  typeSelected: (id?: string) => void;
}> = ({ cdn, typeSelected}) => {
  return <div className="horizontal-stack:s-1 padded:s-1 overflowScroll noOverflowY  ">
    {Object.keys(cdn).map((k) => (
      <div
        key={`choosesticker-${k}`}
        onClick={(e) => typeSelected(k)}
        style={{ width: "15ch", backgroundColor: "rgba(255, 255, 255, 0.5)"}}
        className="padded:s-2 border-radius border"
      > <StickerImage url={cdn[k].imageURL} /></div>
    ))}
  </div>
}
