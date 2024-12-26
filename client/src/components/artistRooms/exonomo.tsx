
import { Chat } from "../interactive/chat";
import React from "react";


const Exonomo: React.FC = () => {
    return (
        <main
            className="fullBleed noOverflow relative"
            style={
                { background: "pink", "--stickerSize": "10%" } as React.CSSProperties
            }
        >
            <Chat key="chat" />
            <iframe src="https://idpw.org/bedroom/" className="fullBleed videoLayer" style={{ border: "none" }} />
        </main>
    );
};


export const ExonomoPreview = () => {
    return <div className="fullBleed">
        <img src="https://storage.googleapis.com/is-this-thing-on/misc/ipdw.png" className="fullBleed" alt="Watching grass grow" draggable={false} />
    </div>
}


export default Exonomo;
