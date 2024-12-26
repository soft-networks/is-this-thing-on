
import Draggable from "react-draggable";
import { Chat } from "../interactive/chat";
import React, { createRef } from "react";


const Coffee: React.FC = () => {
    let panelRef = createRef<HTMLDivElement>();

    return (
        <main
            className="fullBleed noOverflow relative"
            style={
                { background: "pink", "--stickerSize": "10%" } as React.CSSProperties
            }
        >
            <Draggable nodeRef={panelRef}>
                <img src="https://storage.googleapis.com/is-this-thing-on/misc/trojan-room-coffee-pot.gif" 
                    style={{ position: "absolute", top: "10%", left: "30%", width: "10%", height: "auto" }} 
                    className="stickerLayer noSelect draggable" 
                    draggable={false}
                />
            </Draggable>
            <div
                className="lightFill fullBleed videoLayer noEvents noSelect coverBG"
                draggable={false}
            />
            <Chat key="chat" />

        </main>
    );
};

export const CoffeePreview = () => {
    return (
        <div className="fullBleed faintWhiteFill">
            <img src="https://storage.googleapis.com/is-this-thing-on/misc/trojan-room-coffee-pot.gif" 
                style={{ position: "absolute", top: "var(--s0)", left: "var(--s0)", width: "20%", height: "auto" }} 
                className="stickerLayer "
                draggable={false}
            />

        </div>
    );
}


export default Coffee;
