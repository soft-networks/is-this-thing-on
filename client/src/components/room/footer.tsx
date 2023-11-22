import Link from "next/link";
import { useCallback } from "react";
import AccountButton from "../account/accountButton";
import Ring from "../rings/smallRing";
import RoomEnergy  from "./roomEnergy";
import { useRoomStore } from "../../stores/roomStore";
import { useRouter } from "next/router";


const Footer: React.FC = () => {
    const roomID = useRoomStore(useCallback(state => state.currentRoomID,[]));
    return (
      <footer className="align-end:fixed fullWidth uiLayer noEvents childEvents" >
        {roomID && <div className="uiLayer padded:s-1 centerh:absolute align-end:absolute  overflowVisible ">
          <Ring collapsed/>
        </div>}
        <div className="uiLayer horizontal-stack:s-2 padded:s-1 " style={{position: "absolute", bottom: 0, right: 0}}>
          <HomeButton/>
          <AccountButton/>
        </div>
      </footer>
    )
}

const HomeButton : React.FC = () => {
  const { pathname, back } = useRouter();
  return pathname == "/" ? (
    <Link href={"/about"} passHref ><div className="padded:s-2 border clickable whiteFill contrastFill:hover">about</div></Link>
  ) : (
    <Link href={"/"} passHref ><div className="padded:s-2 border clickable whiteFill contrastFill:hover">is this thing on?</div></Link>
  )
}

export default Footer