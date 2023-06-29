import { MouseEventHandler, useMemo, useRef, useState } from "react";
import { StickerAdderProps } from "../stickerAdders";
import classnames from "classnames";
import { StickerImage } from "../stickerRenderHelpers";

/** Future note: this is bascially the default adder word for word, with a different type chooser. can abstract */

export const CompromisedStickerAdder: React.FC<StickerAdderProps> = ({ addSticker, cdn, containerBounds, isAdmin }) => {
  const [showStickerTypePicker, setShowStickerTypePicker] = useState<boolean>(false);
  const currentPosChosen = useRef<Pos>();
  const clicked: MouseEventHandler<HTMLDivElement> = (e) => {
    if (!showStickerTypePicker) {
      if (containerBounds && cdn && Object.keys(cdn).length > 0) {
        let x = (e.clientX - containerBounds.left) / containerBounds.width;
        let y = (e.clientY - containerBounds.top) / containerBounds.height;
        currentPosChosen.current = [x, y];
        console.log(e.pageX, e.pageY, containerBounds, currentPosChosen.current);
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
        console.log("Something bad happened");
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
          <ChooseType cdn={cdn} typeSelected={typeChosen}/>
        </div>
      ) : null}
    </div>
  );
};

const ChooseType: React.FC<{ cdn: StickerCDN; typeSelected: (id?: string) => void }> = ({ cdn, typeSelected }) => {
  const grid = useMemo(() => {
    const masterArr: string[][] = [];
    let arr: string[] = [];
    const keys = Object.keys(cdn);
    let n =0;
    for (let i = 0; i < keys.length; i++) {
      n++;
      arr.push(keys[i]);
      if (n == 8) {
        masterArr.push([...arr]);
        arr = [];
        n = 0;
      }
    }
    masterArr.push([...arr]);
    return masterArr;
  }, [cdn]);

  return (
    <>
      <div
        className={"grid:s-2 skrimFill border-radius padded higherThanStickerLayer"}
        style={{ maxWidth: "calc(4 * (var(--stickerSize) + 2 * var(--s2))" }}
      >
        <div
          className="lightFill border contrastFill:hover padded:s-2 clickable "
          style={{ position: "absolute", top: "calc(-1 * var(--s1)", left: "calc(-1 * var(--s1)" }}
          onClick={(e) => typeSelected(undefined)}
        >
          cancel
        </div>
        <div className="stack padded">
          {grid.map((arr, i) => (
            <div className="horizontal-stack" key={`stickerrow-${i}`}>
              {arr.map((k) => (
                <div
                  className="clickable:opacity"
                  key={`choosesticker-${k}`}
                  onClick={(e) => typeSelected(k)}
                  style={{ width: "var(--stickerSize)" }}
                >
                  <StickerImage url={cdn[k].imageURL + "?" + Date.now()} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
