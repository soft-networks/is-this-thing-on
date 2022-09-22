import { useCallback } from "react";
import AccountButton from "../components/accountButton";
import Ring from "../components/ring";
import { RoomEnergy } from "../components/roomInfo";
import { useRoomStore } from "../stores/roomStore";


const Footer: React.FC = () => {
    const roomID = useRoomStore(useCallback(state => state.currentRoomID,[]));
    return (
      <footer className="align-end:absolute " >
        {roomID && <div className="padded:s2 highest" style={{position: "absolute", bottom: 0, left: 0}}>
          <RoomEnergy roomID={roomID}/>
        </div>}
        {roomID && <div className="padded:s2 highest centerh:absolute align-end:absolute  overflowVisible highest">
          <Ring collapsed/>
        </div>}
        <div className="padded:s2 highest" style={{position: "absolute", bottom: 0, right: 0}}>
          <AccountButton/>
        </div>
      </footer>
    )
}

export default Footer