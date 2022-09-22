import Account from "../components/account";
import Ring from "../components/ring";
import { RoomEnergy } from "../components/roomInfo";


const Footer: React.FC = () => {
    return (
      <div className="footer align-end:absolute ">
        <div className="padded:s1" style={{position: "absolute", bottom: 0, left: 0}}>
          <RoomEnergy/>
        </div>
        <div className="padded:s1 centerh:absolute align-end:absolute  overflowVisible highest">
            <Ring collapsed/>
        </div>
        <div className="padded:s1" style={{position: "absolute", bottom: 0, right: 0}}>
          <Account/>
        </div>
      </div>
    
    )
}

export default Footer