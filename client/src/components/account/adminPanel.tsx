import { createRef, useCallback, useEffect, useState } from "react";

import AdminStreamPanel from "./adminStreamPanel";
import Draggable from "react-draggable";
import classnames from "classnames";
import { resetStickers } from "../../lib/firestore";
import { useGlobalAdminStore } from "../../stores/globalUserAdminStore";
import { useRoomStore } from "../../stores/currentRoomStore";
import StickerAdminPanel from "./adminStickerPanel";
import ArchivePanel from "./archivePanel";

const AdminPanel = ({
  rtmpsDetails,
}: {
  rtmpsDetails: RtmpsDetails | null;
}) => {
  const isAdmin = useGlobalAdminStore(useCallback((s) => s.isAdmin, []));
  return isAdmin ? <AdminPanelInternal rtmpsDetails={rtmpsDetails} /> : null;
};

const AdminPanelInternal: React.FC<{ rtmpsDetails: RtmpsDetails | null }> = ({
  rtmpsDetails,
}) => {
  let panelRef = createRef<HTMLDivElement>();
  const roomID = useRoomStore(useCallback((s) => s.roomInfo?.roomID, []));
  const [closePanel, setClosePanel] = useState(false);

  return <>
    {closePanel && <div className="mars" style={{ background: "none", position: "fixed", height: "12px", width: "12px", bottom: "2px", right: "2px" }} onClick={() => setClosePanel(false)}></div> }
    <Draggable handle=".handle" nodeRef={panelRef}>
      <div
        className={classnames("stack:noGap lightFill relative border uiLayer minTextWidthMedium mars", { "hide": closePanel })}
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
          <div onClick={() => setClosePanel(true)} className="align-end whiteFill border padded:s-3 greenFill:hover cursor:pointer">
            close admin panel
          </div>
          {roomID && <AdminStreamPanel rtmpsDetails={rtmpsDetails} />}
          {roomID && roomID !== "you" && <ArchivePanel roomID={roomID} />}
          {roomID && <StickerAdminPanel roomID={roomID} />}

        </div>
      </div>
    </Draggable></>
};


export default AdminPanel;
