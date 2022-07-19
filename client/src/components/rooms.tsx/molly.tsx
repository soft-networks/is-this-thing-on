import React from "react";
import { Chat } from "../chat";
import RoomInfoViewer from "../roomInfoViewer";
import VideoPlayer from "../videoPlayer";
import Coins from "./coins";
import Gifts from "./gifts";


const Molly: React.FC = () => {

  return (
    <div className="stack quarterWidth">
    <RoomInfoViewer />
    <Gifts/>
    </div>
  );
}

export default Molly;