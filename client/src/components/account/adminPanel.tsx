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
  const roomName = useRoomStore(useCallback((s) => s.roomInfo?.roomID, []));
  let panelRef = createRef<HTMLDivElement>();

  return (
    <Draggable handle=".handle" nodeRef={panelRef}>
      <div
        className="stack:s-2 grayFill relative border uiLayer showOnHoverSelfTrigger "
        style={{ position: "fixed", top: "var(--s3)", right: "var(--s1)" }}
        ref={panelRef}
      >
        <div
          className="handle horizontal-stack padded:s-2 caption"
          style={{
            minHeight: "var(--sp0)",
            height: "var(--sp0)",
            background: "black",
            color: "white",
          }}
        >
          <div>...</div>
          <div>Admin Panel</div>
        </div>
        <div className="padded:s-2 stack:s-1 monospace">
          <StickerOverride />
          <VideoOverride />
          {roomName && (
            <div
              className={classnames(
                "padded:s-2 whiteFill clickable contrastFill:hover",
              )}
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
  const stickerBehaviorOverride = useAdminStore(
    useCallback((s) => s.stickerBehaviorOverride, []),
  );
  const setStickerBehaviorOverride = useAdminStore(
    useCallback((s) => s.setStickerBehaviorOverride, []),
  );

  return (
    <div className="highestLayer stack:s-2 whiteFill padded:s-2 ">
      <div>Special Sticker Behavior</div>
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

const VideoOverride: React.FC = () => {
  const hideVideo = useAdminStore(useCallback((s) => s.hideVideo, []));
  const setVideoOverride = useAdminStore(
    useCallback((s) => s.setHideVideo, []),
  );
  return (
    <div
      className={classnames(
        "padded:s-2 whiteFill clickable contrastFill:hover",
      )}
      onClick={() => setVideoOverride(!hideVideo)}
    >
      {hideVideo ? "🙃 Show video" : "🫥 Hide video"}
    </div>
  );
};

export default AdminPanel;
