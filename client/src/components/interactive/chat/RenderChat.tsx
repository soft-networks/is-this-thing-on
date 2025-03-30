import React, { useState, useRef, useEffect } from "react";
import { deleteChatMessageDB } from "../../../lib/firestore";
import { useGlobalAdminStore } from "../../../stores/globalUserAdminStore";
import useMediaQuery from "../../../stores/useMediaQuery";
import { CHAT_HEIGHT } from "./utils";

//Write a simple value remapping function like p5.js map
export function remap(
  value: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number,
) {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

export const RenderChat: React.FC<{
  id: string;
  chat: ChatMessage;
  lastRecalculationUpdate: number;
  alwaysShow?: boolean;
  hideControls?: boolean; 
}> = ({ chat, id, lastRecalculationUpdate, alwaysShow, hideControls }) => {

  const [myBlurPercentage, setMyBlurPercentage] = useState<number>(0);
  //Create a ref to reference the dom
  const myRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery();
  const isAdmin = useGlobalAdminStore((state) => state.isAdmin);
  useEffect(() => {
    if (myRef.current) {
      const y = myRef.current.getBoundingClientRect().top;
      let percentage = remap(
        y,
        (CHAT_HEIGHT - 0.05) * window.innerHeight,
        window.innerHeight - 400,
        0,
        1
      );
      //percentage = 0;
      if (!isMobile) {
        setMyBlurPercentage(percentage);
      } else {
        setMyBlurPercentage(1);
      }
    }
  }, [myRef.current, lastRecalculationUpdate]);

  return (
    <div
      className="stack:noGap fullWidth align-start relative chatBubble inline-block"
      style={{
        marginBlockStart: "var(--s-2)",
        opacity: alwaysShow ? 1 : myBlurPercentage,
      }}
      ref={myRef}
      key={id + "chat-" + isAdmin}
    >
      <div className="horizontal-stack:s-2">
        <div
          className="caption backgroundFill border-radius border inline-block"
          style={{ top: "-17px", padding: "4px" }}
        >
          {chat.username || "unknown"}
        </div>
        {isAdmin && !hideControls && <div className="caption whiteFill greenFill:hover border cursor:pointer" style={{ padding: "4px" }} onClick={() => deleteChatMessageDB(id)}>
          delete
        </div>}
      </div>
      <div
        key={id}
        className="padded:s-2 chatMessage border-radius relative inline-block border "
        style={{
          background: "var(--chatMessageBackgroundColor)",
          color: "var(--chatMessageColor)",
          marginTop: "-3px",
        }}
      >
        <div>{chat.message}</div>
      </div>
    </div>
  );
};
