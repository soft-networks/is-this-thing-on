import { useCallback, useState } from "react";
import { useGlobalUserStore } from "../../stores/globalUserStore";
import { ChangeUsername, SignOut } from "./userManagement";
import { User } from "firebase/auth";
import RoomManagement from "./roomManagement";

const LoggedInSettings: React.FC<{ currentUser: User }> = ({ currentUser }) => {
    const displayName = useGlobalUserStore(
      useCallback((state) => state.displayName, []),
    );
    return (
      <div className="fullHeight stack:s1 quarterWidth centerh  padded overflowScroll">
          <div className="stack padded align-start border:gray" key="details">
            <em className="inline-block"> account details </em>
            <div> email: {currentUser.email} </div>
            <div> username: {displayName} </div>
            <div> userid: {currentUser.uid} </div>
            <SignOut />
          </div>
          <div className="stack padded border:gray" key="username">
            <em className="inline-block"> change username </em>
            <ChangeUsername />
          </div>
        <RoomManagement uid={currentUser.uid} />
      </div>
    );
  };

  

  
  
  export default LoggedInSettings;