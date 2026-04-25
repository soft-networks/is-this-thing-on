import { createRef, useState } from "react";
import Draggable from "react-draggable";
import { setArchiveRoomChatDisabled } from "../../lib/firestore/archive";
import { doc, updateDoc } from "firebase/firestore";
import db from "../../lib/firestore/init";

const ArchiveAdminPanel: React.FC<{
  archiveID: string;
  room: ArchiveRoomInfo;
}> = ({ archiveID, room }) => {
  const [closed, setClosed] = useState(false);
  const panelRef = createRef<HTMLDivElement>();

  if (closed) {
    return (
      <div className="highestLayer padded:s-2" style={{ position: "fixed", top: "0px", right: "0px" }}>
        <div
          className="mars border-thin whiteFill padded:s-3 cursor:pointer greenFill:hover"
          onClick={() => setClosed(false)}
        >
          admin panel
        </div>
      </div>
    );
  }

  return (
    <Draggable handle=".handle" nodeRef={panelRef}>
      <div
        className="stack:noGap lightFill relative border uiLayer minTextWidthMedium mars"
        style={{ position: "fixed", top: "0px", right: "var(--s1)", maxHeight: "calc(70vh)", overflowY: "auto" }}
        ref={panelRef}
      >
        <div
          className="handle horizontal-stack padded:s-2 caption"
          style={{ minHeight: "var(--sp0)", height: "var(--sp0)", background: "black", color: "white" }}
        >
          <div>...</div>
          <div>Admin Panel</div>
        </div>
        <div className="padded:s-1 stack:s1 monospace">
          <div onClick={() => setClosed(true)} className="align-end whiteFill border padded:s-3 greenFill:hover cursor:pointer">
            close admin panel
          </div>
          <ChatToggle archiveID={archiveID} room={room} />
          <ArchiveURLEditor archiveID={archiveID} room={room} />
        </div>
      </div>
    </Draggable>
  );
};

const ChatToggle: React.FC<{ archiveID: string; room: ArchiveRoomInfo }> = ({ archiveID, room }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="stack:s-1">
      <div className="horizontal-stack cursor:pointer greenFill inline-block" onClick={() => setExpanded(!expanded)}>
        <div>{expanded ? "-" : "+"}</div>
        <div>Chat controls</div>
      </div>
      {expanded && (
        <div
          className="whiteFill border padded:s-3 cursor:pointer greenFill:hover"
          onClick={() => setArchiveRoomChatDisabled(archiveID, room.roomID, !room.chatDisabled)}
        >
          {room.chatDisabled ? "enable chat" : "disable chat"}
        </div>
      )}
    </div>
  );
};

const ArchiveURLEditor: React.FC<{ archiveID: string; room: ArchiveRoomInfo }> = ({ archiveID, room }) => {
  const [expanded, setExpanded] = useState(false);
  const [url, setUrl] = useState(room.archiveURL || "");
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    const roomRef = doc(db, "archives", archiveID, "rooms", room.roomID);
    await updateDoc(roomRef, { archive_url: url });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="stack:s-1">
      <div className="horizontal-stack cursor:pointer greenFill inline-block" onClick={() => setExpanded(!expanded)}>
        <div>{expanded ? "-" : "+"}</div>
        <div>Video URL</div>
      </div>
      {expanded && (
        <div className="stack:s-1">
          <input
            className="border padded:s-3 fullWidth monospace"
            style={{ fontSize: "0.75em" }}
            value={url}
            onChange={(e) => { setUrl(e.target.value); setSaved(false); }}
            placeholder="https://..."
          />
          <div
            className="whiteFill border padded:s-3 cursor:pointer greenFill:hover"
            onClick={handleSave}
          >
            {saved ? "saved!" : "save url"}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchiveAdminPanel;
