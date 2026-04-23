import classnames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGlobalAdminStore } from "../../stores/globalUserAdminStore";
import { resetStickers, addStickerToCDN, deleteStickerFromCDN, setStickerCDNActive, syncStickerCDNAll } from "../../lib/firestore/stickers";
import { Unsubscribe } from "firebase/firestore";

const StickerAdminPanel: React.FC<{ roomID: string }> = ({ roomID }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="stack:s-1">
      <div className="horizontal-stack cursor:pointer greenFill inline-block" onClick={() => setExpanded(!expanded)}>
        <div>{expanded ? "-" : "+"}</div>
        <div>Sticker controls</div>
      </div>
      {expanded && (
        <>
          <div
            className={classnames("padded:s-2 whiteFill clickable greenFill:hover border")}
            onClick={() => resetStickers(roomID)}
          >
            Reset Stickers
          </div>
          <StickerOverride />
          <StickerCDNManager roomID={roomID} />
        </>
      )}
    </div>
  );
};

const StickerCDNManager: React.FC<{ roomID: string }> = ({ roomID }) => {
  const [cdn, setCdn] = useState<{ [key: string]: Sticker }>({});
  const [url, setUrl] = useState("");
  const [adding, setAdding] = useState(false);
  const unsubRef = useRef<Unsubscribe | undefined>();

  useEffect(() => {
    unsubRef.current = syncStickerCDNAll(roomID, setCdn);
    return () => { unsubRef.current && unsubRef.current(); };
  }, [roomID]);

  const handleAdd = async () => {
    if (!url.trim()) return;
    setAdding(true);
    await addStickerToCDN(roomID, url.trim());
    setUrl("");
    setAdding(false);
  };

  const entries = Object.entries(cdn);

  return (
    <div className="stack:s-1">
      <div className="caption">Sticker library ({entries.length})</div>
      {entries.length > 0 && (
        <div className="stack:s-1" style={{ maxHeight: "200px", overflowY: "auto" }}>
          {entries.map(([id, sticker]) => (
            <div key={id} className="horizontal-stack:s-1 border padded:s-3 whiteFill" style={{ alignItems: "center" }}>
              <img src={sticker.imageURL} alt="" style={{ width: "32px", height: "32px", objectFit: "contain", flexShrink: 0 }} />
              <div className="flex-1 monospace" style={{ fontSize: "0.65em", wordBreak: "break-all", opacity: 0.5 }}>{sticker.imageURL}</div>
              <div
                className={classnames("padded:s-3 border cursor:pointer", { "greenFill": sticker.active !== false, "whiteFill": sticker.active === false })}
                onClick={() => setStickerCDNActive(roomID, id, sticker.active === false)}
                style={{ flexShrink: 0, fontSize: "0.75em" }}
              >
                {sticker.active !== false ? "on" : "off"}
              </div>
              <div
                className="padded:s-3 border cursor:pointer whiteFill greenFill:hover"
                onClick={() => deleteStickerFromCDN(roomID, id)}
                style={{ flexShrink: 0, fontSize: "0.75em" }}
              >
                ✕
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="stack:s-1">
        <input
          className="border padded:s-3 fullWidth monospace"
          style={{ fontSize: "0.75em" }}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://... (gif or png url)"
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <div
          className={classnames("whiteFill border padded:s-3 cursor:pointer greenFill:hover", { "opacity:hover": !url.trim() })}
          onClick={handleAdd}
        >
          {adding ? "adding..." : "add sticker"}
        </div>
      </div>
    </div>
  );
};

const StickerOverride: React.FC = () => {
  const stickerBehaviorOverride = useGlobalAdminStore(
    useCallback((s) => s.stickerBehaviorOverride, []),
  );
  const setStickerBehaviorOverride = useGlobalAdminStore(
    useCallback((s) => s.setStickerBehaviorOverride, []),
  );

  return (
    <div className="highestLayer stack:s-2 lightFill border:gray padded:s-2">
      <div>Override Sticker Behavior</div>
      <div className="horizontal-stack">
        <div className="horizontal-stack:s-2 everest">
          <label>Move</label>
          <input type="checkbox" checked={stickerBehaviorOverride == "MOVE"} onChange={() => setStickerBehaviorOverride("MOVE")} />
        </div>
        <div className="horizontal-stack:s-2">
          <label>Delete</label>
          <input type="checkbox" checked={stickerBehaviorOverride == "DELETE"} onChange={() => setStickerBehaviorOverride("DELETE")} />
        </div>
        <div className="horizontal-stack:s-2">
          <label>Regular</label>
          <input type="checkbox" checked={stickerBehaviorOverride == undefined} onChange={() => setStickerBehaviorOverride(undefined)} />
        </div>
      </div>
    </div>
  );
};

export default StickerAdminPanel;
