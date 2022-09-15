import React from "react";
import { Chat } from "../chat";
import RoomInfoViewer from "../roomInfo";
import Stream from "../stream";
import Stickers from "../stickers";
import Footer from "../../layouts/footer";


const Molly: React.FC = () => {

  return (
    <div className="stack quarterWidth">
    <RoomInfoViewer />

    </div>
  );
}

export default Molly;