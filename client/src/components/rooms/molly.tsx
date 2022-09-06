import React from "react";
import { Chat } from "../chat";
import RoomInfoViewer from "../roomInfo";
import Stream from "../stream";
import Coins from "../coins";
import Gifts from "../gifts";
import Footer from "../../layouts/footer";


const Molly: React.FC = () => {

  return (
    <div className="stack quarterWidth">
    <RoomInfoViewer />
    <Gifts/>
    </div>
  );
}

export default Molly;