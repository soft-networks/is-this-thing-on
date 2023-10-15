import Link from "next/link";
import { useCallback } from "react";
import AccountButton from "../account/accountButton";
import Ring from "../rings/smallRing";
import RoomEnergy  from "./roomEnergy";
import { useRoomStore } from "../../stores/roomStore";


const Footer: React.FC = () => {
    const roomID = useRoomStore(useCallback(state => state.currentRoomID,[]));
    return (
      <footer className="align-end:fixed fullWidth uiLayer noEvents childEvents" >
        {roomID && <div className="uiLayer padded:s2  horizontal-stack" style={{position: "absolute", bottom: 0, left: 0}}>
          <Link href={"/"} passHref ><div className="padded:s-2 border clickable whiteFill contrastFill:hover"> home </div></Link>
          <RoomEnergy roomID={roomID}/>
        </div>}
        {roomID && <div className="uiLayer padded:s2  centerh:absolute align-end:absolute  overflowVisible ">
          <Ring collapsed/>
        </div>}
        <div className="uiLayer padded:s2 " style={{position: "absolute", bottom: 0, right: 0}}>
          <AccountButton/>
        </div>
      </footer>
    )
}

export default Footer