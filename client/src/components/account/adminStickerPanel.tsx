import classnames from "classnames";
import { useCallback, useState } from "react";
import { useGlobalAdminStore } from "../../stores/globalUserAdminStore";
import { resetStickers } from "../../lib/firestore/stickers";

const StickerAdminPanel: React.FC<{ roomID: string }> = ({ roomID }) => {

    const [expanded, setExpanded] = useState(false);
    return (
      <div className="stack:s-1">
        <div className="horizontal-stack cursor:pointer greenFill inline-block" onClick={() => setExpanded(!expanded)}>
          <div>{expanded ? "-" : "+"}</div>
          <div>Sticker controls</div>
        </div>
        {expanded && (
          <div
            className={classnames(
              "padded:s-2 whiteFill clickable greenFill:hover border",
            )}
            onClick={() => resetStickers(roomID)}
          >
            Reset Stickers
          </div>
        )}
        {expanded && <StickerOverride />}
      </div>
    )
  };
  
  const StickerOverride: React.FC = () => {
    const stickerBehaviorOverride = useGlobalAdminStore(
      useCallback((s) => s.stickerBehaviorOverride, []),
    );
    const setStickerBehaviorOverride = useGlobalAdminStore(
      useCallback((s) => s.setStickerBehaviorOverride, []),
    );
  
    return (
      <div className="highestLayer stack:s-2 lightFill border:gray padded:s-2 ">
        <div>Override Sticker Behavior</div>
        <div className="horizontal-stack">
          <div className="horizontal-stack:s-2 everest">
            <label>Move</label>
            <input
              type="checkbox"
              checked={stickerBehaviorOverride == "MOVE"}
              onChange={() => setStickerBehaviorOverride("MOVE")}
            />
          </div>
          <div className="horizontal-stack:s-2">
            <label>Delete</label>
            <input
              type="checkbox"
              checked={stickerBehaviorOverride == "DELETE"}
              onChange={() => setStickerBehaviorOverride("DELETE")}
            />
          </div>
          <div className="horizontal-stack:s-2">
            <label>Regular</label>
            <input
              type="checkbox"
              checked={stickerBehaviorOverride == undefined}
              onChange={() => setStickerBehaviorOverride(undefined)}
            />
          </div>
        </div>
      </div>
    );
  };
  
  
  export default StickerAdminPanel;