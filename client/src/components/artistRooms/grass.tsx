
import { Chat } from "../interactive/chat";
import React from "react";


const Grass: React.FC = () => {

    return (
        <main
            className="fullBleed noOverflow relative"
            style={
                { background: "pink", "--stickerSize": "10%" } as React.CSSProperties
            }
        >
            <Chat key="chat" />

            <iframe src="https://www.watching-grass-grow.com/" className="fullBleed videoLayer" style={{ border: "none" }} />
        </main>
    );
};


export const GrassPreview = () => {
    return <div className="fullBleed">
        <img src="https://webcama1.watching-grass-grow.com/current.jpg" className="fullBleed" alt="Watching grass grow" draggable={false} />
    </div>
}


export default Grass;
