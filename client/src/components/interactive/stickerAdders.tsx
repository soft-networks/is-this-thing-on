import classnames from "classnames";
import { MouseEventHandler, useCallback, useRef, useState } from "react";
import { RectReadOnly } from "react-use-measure";
import { StickerImage } from "./stickerRenderHelpers";
import { logError } from "../../lib/logger";
import { useAdminStore } from "../../stores/adminStore";

export interface StickerAdderProps {
  addSticker: (pos: Pos, cdnID: string, scale?: number) => void;
  cdn: StickerCDN;
  containerBounds: RectReadOnly;
}

export const EmptyChooser: React.FC<StickerAdderProps> = ({}) =>{
  return null
}

export const RandomStickerAdder: React.FC<StickerAdderProps> = ({ addSticker, cdn, containerBounds}) => {
  const currentPosChosen = useRef<Pos>();
  const clicked: MouseEventHandler<HTMLDivElement> = (e) => {
      if (containerBounds && cdn && Object.keys(cdn).length > 0) {  
        let x = (e.clientX - containerBounds.left) / containerBounds.width;
        let y = (e.clientY - containerBounds.top) / containerBounds.height;
        currentPosChosen.current = [x, y];
        
        addSticker(currentPosChosen.current || [0, 0], Object.keys(cdn)[Math.floor(Math.random() * Object.keys(cdn).length)]);
      }
    }
  return (
    <div
      className={classnames("fullBleed absoluteOrigin addCursor")}
      onClick={clicked}
    >
    </div>
  );
}
export const DefaultStickerAdder: React.FC<StickerAdderProps> = ({ addSticker, cdn, containerBounds}) => {
  const isAdmin = useAdminStore(useCallback((s) => s.isAdmin, []));
  const [showStickerTypePicker, setShowStickerTypePicker] = useState<boolean>(false);
  const currentPosChosen = useRef<Pos>();
  const clicked: MouseEventHandler<HTMLDivElement> = (e) => {
    if (!showStickerTypePicker) {
      if (containerBounds && cdn && Object.keys(cdn).length > 0) {        
        let x = (e.clientX - containerBounds.left) / containerBounds.width;
        let y = (e.clientY - containerBounds.top) / containerBounds.height;
        currentPosChosen.current = [x, y];
        setShowStickerTypePicker(true);
      }
    } else {
      setShowStickerTypePicker(false);
    }
  };
  const typeChosen = (id?: string) => {
    setShowStickerTypePicker(false);
    if (id) {
      if (currentPosChosen.current) {
        addSticker(currentPosChosen.current || [0, 0], id);
      } else {
        logError("Something bad happened with adding a sticker");
      }
    }
  };
  return (
    <div
      className={classnames("fullBleed absoluteOrigin", {
        addCursor: !showStickerTypePicker,
        closeCursor: showStickerTypePicker,
      })}
      onClick={clicked}
    >
      {showStickerTypePicker ? (
        <div
          className="absoluteOrigin "
          style={{
            top: `${currentPosChosen.current ? currentPosChosen.current[1] * 100 : 80}%`,
            left: `${currentPosChosen.current ? currentPosChosen.current[0] * 100 : 50}%`,
          }}
        >
          <DefaultChooseStickerType cdn={cdn} typeSelected={typeChosen}  />
        </div>
      ) : null}
    </div>
  );
};

export const AdminOnlyStickerAdder: React.FC<StickerAdderProps> = ({addSticker, cdn, containerBounds}) => {
  const isAdmin = useAdminStore(useCallback((s) => s.isAdmin, []));
  if(isAdmin) return <DefaultStickerAdder addSticker={addSticker} cdn={cdn} containerBounds={containerBounds}/>
  else return null
}

export const PopupStickerAdder: React.FC<StickerAdderProps> = ({addSticker, cdn, containerBounds}) => {
  const [chooserOpen, setChooserOpen] = useState<boolean>(false);
  const typeChosen = (id?: string) => {
    setChooserOpen(false);
    if (id) {
        addSticker([Math.random(), 0.5 +  Math.random()/2], id, cdn[id].size || 0.1);
    }
  };
  return (
    <>
      {!chooserOpen && (
        <div
          className="uiLayer padded:s-1 whiteFill contrastFill:hover absoluteOrigin border clickable"
          style={{ top: "85%", left: "50%", transform: "translate(-50%, -50%)" }}
          onClick={() => setChooserOpen(!chooserOpen)}
        >
          gift me
        </div>
      )}
      {chooserOpen && (
        <div className="uiLayer absoluteOrigin " style={{ top: "85%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <DefaultChooseStickerType cdn={cdn} typeSelected={typeChosen} className="grid:s-2 padded lightFill" style={{maxWidth: "100%", "--stickerSize": "12ch"} as React.CSSProperties}/>
        </div>
      )}
    </>
  );
}


const DefaultChooseStickerType: React.FC<{ cdn: StickerCDN; typeSelected: (id?: string) => void, style?: React.CSSProperties, className?: string}> = ({
  cdn,
  typeSelected,
  style,
  className
}) => {
  return (
    <>
      <div
        className={"uiLayer" + (className || "grid:s-2 skrimFill border-radius padded")}
      >
        <div
          className="lightFill border contrastFill:hover padded:s-2 clickable"
          style={{ position: "absolute", top: "calc(-1 * var(--s1)", left: "calc(-1 * var(--s1)" }}
          onClick={(e) => typeSelected(undefined)}
        >
          cancel
        </div>
        {Object.keys(cdn).map(
          (k) =>
            !cdn[k].noGift  && (
              <div
                className="clickable:opacity"
                key={`choosesticker-${k}`}
                onClick={(e) => typeSelected(k)}
                style={{ width: "var(--stickerSize)" }}
              >
                <StickerImage url={cdn[k].imageURL} />
              </div>
            )
        )}
      </div>
    </>
  );
};
