
import ReactPlayer from "react-player";
import { Chat } from "../interactive/chat";
import React, { createRef } from "react";
import Draggable from "react-draggable";


const Exonomo: React.FC = () => {
    let panelRef = createRef<HTMLDivElement>();

    return (
        <main
            className="fullBleed noOverflow relative"
            style={
                { "--stickerSize": "10%" } as React.CSSProperties
            }
        >
            <Chat key="chat" />
            <Draggable nodeRef={panelRef} >
                <img src="https://storage.googleapis.com/is-this-thing-on/misc/ipdw.png" 
                    style={{ position: "absolute", top: "10%", left: "30%", width: "15%", height: "auto" }} 
                    className="stickerLayer noSelect draggable cursor:link" 
                    onClick={() => window.open("https://idpw.org/bedroom/", "_blank")}
                    draggable={false}
                />
            </Draggable>
            <div className="fullBleed videoLayer">
                <ReactPlayer url="https://www.dropbox.com/s/pyjs9fswrlq5r2w/room2-1_edited.m4v?dl=1" className="fullBleed videoLayer" width="100%" height="auto"  controls={true} autoPlay={true} muted={true}/>
            </div>
            {/* <iframe src="https://idpw.org/bedroom/" className="fullBleed videoLayer" style={{ border: "none" }} /> */}
        </main>
    );
};


export const ExonomoPreview = () => {
    return <div className="fullBleed">
        <img src="https://storage.googleapis.com/is-this-thing-on/misc/ipdw.png" className="fullBleed" alt="Watching grass grow" draggable={false} />
    </div>
}


export default Exonomo;
