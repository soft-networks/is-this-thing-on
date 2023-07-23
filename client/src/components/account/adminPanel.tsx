import classnames from "classnames";
import { useAdminStore } from "../../stores/adminStore";
import { createRef, useCallback } from "react";
import { resetStickers } from "../../lib/firestore";
import { useRoomStore } from "../../stores/roomStore";
import Draggable from "react-draggable";

const AdminPanel = () => {
  const isAdmin = useAdminStore(useCallback((s) => s.isAdmin, []));
  return isAdmin ? <AdminPanelInternal /> : null;
};

const AdminPanelInternal: React.FC<{}> = () => {
  const roomName = useRoomStore(useCallback((s) => s.roomInfo?.roomName, []));
  let panelRef = createRef<HTMLDivElement>();

  return (
    <Draggable handle=".handle" nodeRef={panelRef}>
      <div
        className="stack:s-2 grayFill relative border highestLayer "
        style={{ position: "fixed", top: "var(--s0)" }}
        ref={panelRef}
      >
        <div
          className="handle horizontal-stack padded:s-2 caption"
          style={{ minHeight: "var(--sp0)", height: "var(--sp0)", background: "black", color: "white" }}
        >
          <div>...</div>
          <div>Admin Panel</div>
        </div>
        <div className="padded:s-2 stack:s-1 higherThanStickerLayer monospace">
          <StickerOverride />
          <VideoOverride />
          {roomName && (
            <div
              className={classnames("padded:s-2 whiteFill clickable contrastFill:hover")}
              onClick={() => resetStickers(roomName)}
            >
              ⚠️ Reset Stickers
            </div>
          )}
        </div>
      </div>
    </Draggable>
  );
};

const StickerOverride: React.FC = () => {
  const stickerBehaviorOverride = useAdminStore(useCallback((s) => s.stickerBehaviorOverride, []));
  const setStickerBehaviorOverride = useAdminStore(useCallback((s) => s.setStickerBehaviorOverride, []));

  return (
    <div className="stack:s-2 border-bottom:thin">
      <div>
        <em>Sticker Behavior Override</em>
      </div>
      <div className="horizontal-stack">
        <div className="horizontal-stack:s-2">
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

const VideoOverride: React.FC = () => {
  const videoOverride = useAdminStore(useCallback((s) => s.hideVideo, []));
  const setVideoOverride = useAdminStore(useCallback((s) => s.setHideVideo, []));
  return (
    <div className="horizontal-stack align-end border-bottom:thin">
      <em>Hide video</em>
      <input type="checkbox" checked={videoOverride} onChange={() => setVideoOverride(!videoOverride)} />
    </div>
  );
};

export default AdminPanel;
