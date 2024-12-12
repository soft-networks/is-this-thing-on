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
            <em> account details </em>
            <div> email: {currentUser.email} </div>
            <div> username: {displayName} </div>
            <SignOut />
          </div>
          <div className="stack padded border:gray" key="username">
            <em> change username </em>
            <p>
              you can change your user name - but this will only apply for future
              chats.
            </p>
            <ChangeUsername />
          </div>
        <RoomManagement uid={currentUser.uid} />
      </div>
    );
  };

  

  
  
  export default LoggedInSettings;