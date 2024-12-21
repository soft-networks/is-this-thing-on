import { createRef, useCallback, useState } from "react";

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

  return (
    <Draggable handle=".handle" nodeRef={panelRef}>
      <div
        className="stack:s-2 lightFill relative border faintWhiteFill uiLayer showOnHoverSelfTrigger minTextWidthMedium "
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

        <div className="padded:s-1 stack:s1 monospace">
          {roomID && <StickerAdminPanel roomID={roomID} />}
          <hr />
          {roomID && <AdminStreamPanel rtmpsDetails={rtmpsDetails} />}
          <hr />
          {roomID && <ArchivePanel roomID={roomID} />}
        </div>
      </div>
    </Draggable>
  );
};


export default AdminPanel;
