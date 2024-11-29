import { useEffect } from "react";
import { useCallback, useState } from "react";
import { useUserStore } from "../../stores/userStore";
import { ChangeUsername, SignOut } from "./userManagement";
import { User } from "firebase/auth";
import { getRoomsWhereUserISAdmin } from "../../lib/firestore";
import { CreateRoom, UpdateRoom } from "./roomManagement";

const LoggedInSettings: React.FC<{ currentUser: User }> = ({ currentUser }) => {
    const displayName = useUserStore(
      useCallback((state) => state.displayName, []),
    );
    return (
      <div className="quarterWidth centerh stack:s2 padded">
        <div className="stack padded align-start border-thin" key="details">
          <em> account details </em>
          <div> email: {currentUser.email} </div>
          <div> username: {displayName} </div>
          <SignOut />
        </div>
        <div className="stack padded border-thin" key="username">
          <em> change username </em>
          <p>
            you can change your user name - but this will only apply for future
            chats.
          </p>
          <ChangeUsername />
        </div>
        <CreateRoom uid={currentUser.uid} />
        <UserRoomManager uid={currentUser.uid} />
      </div>
    );
  };

  /**
 * AdminView renders RoomAdminUI for each room that a user id admin for
 */
interface AdminViewProps {
    uid: string;
  }
  const UserRoomManager: React.FC<AdminViewProps> = ({ uid }) => {
    const [rooms, setRooms] = useState<undefined | RoomInfo[]>(undefined);
    useEffect(() => {
      async function getRooms() {
        let rooms = await getRoomsWhereUserISAdmin(uid);
        setRooms(rooms);
      }
      getRooms();
    }, [uid]);
  
    return rooms ? (
      <div className="stack padded border-thin lightFill">
        <div className="stack:s-1">
          <em>Rooms you manage</em>
          {rooms.map((r) => (
            <UpdateRoom
              roomID={r.roomID}
              key={r.roomName + "-adminView"}
              uid={uid}
              room={r}
            />
          ))}
        </div>
      </div>
    ) : (
      <div> you are not the admin for any rooms</div>
    );
  };
  
  
  export default LoggedInSettings;