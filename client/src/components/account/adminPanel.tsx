import { createRef, useCallback, useState } from "react";

import AdminStreamPanel from "./adminStreamPanel";
import Draggable from "react-draggable";
import classnames from "classnames";
import { useGlobalAdminStore } from "../../stores/globalUserAdminStore";
import { useRoomStore } from "../../stores/currentRoomStore";
import StickerAdminPanel from "./adminStickerPanel";
import ArchivePanel from "./archivePanel";
import { doc, updateDoc } from "firebase/firestore";
import db from "../../lib/firestore/init";

const AdminPanel = ({
  rtmpsDetails,
}: {
  rtmpsDetails: RtmpsDetails | null;
}) => {
  const adminForIDs = useGlobalAdminStore(useCallback((s) => s.adminFor, []));
  const roomID = useRoomStore(useCallback((s) => s.currentRoomID, []));
  const isAdmin = !!(roomID && adminForIDs.includes(roomID));
  return isAdmin ? <AdminPanelInternal rtmpsDetails={rtmpsDetails} /> : null;
};

const AdminPanelInternal: React.FC<{ rtmpsDetails: RtmpsDetails | null }> = ({
  rtmpsDetails,
}) => {
  let panelRef = createRef<HTMLDivElement>();
  const roomID = useRoomStore(useCallback((s) => s.roomInfo?.roomID, []));
  const roomInfo = useRoomStore(useCallback((s) => s.roomInfo, []));
  const adminPanelOpen = useGlobalAdminStore(useCallback((s) => s.adminPanelOpen, []));
  const setAdminPanelOpen = useGlobalAdminStore(useCallback((s) => s.setAdminPanelOpen, []));

  return (
    <Draggable handle=".handle" nodeRef={panelRef}>
      <div
        className={classnames("stack:noGap lightFill relative border uiLayer minTextWidthMedium mars", { "hide": !adminPanelOpen })}
        style={{ position: "fixed", top: "var(--s3)", right: "var(--s1)", maxHeight: "calc(70vh)", overflowY: "auto" }}
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

        <div className="padded:s-1 stack:s1 monospace">
          <div onClick={() => setAdminPanelOpen(false)} className="align-end whiteFill border padded:s-3 greenFill:hover cursor:pointer">
            close admin panel
          </div>
          {roomID && <AdminStreamPanel rtmpsDetails={rtmpsDetails} />}
          {roomID && <LiveChatToggle roomID={roomID} chatDisabled={roomInfo?.chatDisabled} />}
          {roomID && roomID !== "you" && <ArchivePanel roomID={roomID} />}
          {roomID && <StickerAdminPanel roomID={roomID} />}
          {roomID && <AutoClearPanel roomID={roomID} autoClearEnabled={roomInfo?.autoClearEnabled} autoClearSeconds={roomInfo?.autoClearSeconds} />}
        </div>
      </div>
    </Draggable>
  );
};

const AutoClearPanel: React.FC<{ roomID: string; autoClearEnabled?: boolean; autoClearSeconds?: number }> = ({ roomID, autoClearEnabled, autoClearSeconds }) => {
  const [expanded, setExpanded] = useState(false);
  const [seconds, setSeconds] = useState(autoClearSeconds ? String(autoClearSeconds) : "60");
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    const roomRef = doc(db, "rooms", roomID);
    await updateDoc(roomRef, {
      auto_clear_enabled: true,
      auto_clear_seconds: Math.max(1, parseFloat(seconds)),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDisable = async () => {
    const roomRef = doc(db, "rooms", roomID);
    await updateDoc(roomRef, { auto_clear_enabled: false });
  };

  return (
    <div className="stack:s-1">
      <div className="horizontal-stack cursor:pointer greenFill inline-block" onClick={() => setExpanded(!expanded)}>
        <div>{expanded ? "-" : "+"}</div>
        <div>Auto-clear stickers {autoClearEnabled ? `(on — ${autoClearSeconds}s)` : "(off)"}</div>
      </div>
      {expanded && (
        <div className="stack:s-1">
          <div className="horizontal-stack:s-1">
            <input
              className="border padded:s-3 monospace"
              style={{ width: "10em", fontSize: "0.85em" }}
              type="number"
              min="1"
              step="1"
              value={seconds}
              onChange={(e) => { setSeconds(e.target.value); setSaved(false); }}
            />
            <div className="padded:s-3">seconds</div>
          </div>
          <div className="whiteFill border padded:s-3 cursor:pointer greenFill:hover" onClick={handleSave}>
            {saved ? "saved!" : "enable + save"}
          </div>
          {autoClearEnabled && (
            <div className="whiteFill border padded:s-3 cursor:pointer greenFill:hover" onClick={handleDisable}>
              disable auto-clear
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const LiveChatToggle: React.FC<{ roomID: string; chatDisabled?: boolean }> = ({ roomID, chatDisabled }) => {
  const [expanded, setExpanded] = useState(false);

  const toggle = async () => {
    const roomRef = doc(db, "rooms", roomID);
    await updateDoc(roomRef, { chat_disabled: !chatDisabled });
  };

  return (
    <div className="stack:s-1">
      <div className="horizontal-stack cursor:pointer greenFill inline-block" onClick={() => setExpanded(!expanded)}>
        <div>{expanded ? "-" : "+"}</div>
        <div>Chat controls</div>
      </div>
      {expanded && (
        <div
          className="whiteFill border padded:s-3 cursor:pointer greenFill:hover"
          onClick={toggle}
        >
          {chatDisabled ? "enable chat" : "disable chat"}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
