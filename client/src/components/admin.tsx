import { updateProfile, User} from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { getRoomsWhereUserISAdmin } from "../lib/firestore";
import { getStreamKey, resetRoom } from "../lib/server-api";
import { useUserStore } from "../stores/userStore";

/**
 * AdminView renders RoomAdminUI for each room that a user id admin for
 */
interface AdminViewProps {
  uid: string;
}
const Admin: React.FC<AdminViewProps> = ({ uid }) => {
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
      <em>
        Rooms you manage
      </em>
      {rooms.map((r) => (
        <RoomAdminUI roomID={r.roomID} key={r.roomName + "-adminView"} uid={uid} />
      ))}
    </div>
  ) : (
    <div> you are not the admin for any rooms</div>
  );
};


const RoomAdminUI: React.FC<{ roomID: string; uid: string }> = ({ roomID, uid }) => {
  let [streamKey, setStreamKey] = useState<string>();

  useEffect(() => {
    //TODO: Send UID here to authenticate with server
    async function getSK() {
      let sk = await getStreamKey(roomID);
      setStreamKey(sk);
    }
    getSK();
  }, [roomID]);

  return (
    <div className="stack padded border-thin whiteFill">
      <div> <span className="contrastFill">{roomID}</span> </div>
      <div>stream key: <br/>{streamKey}</div>
      <div
        onClick={() => {
          resetRoom(roomID);
          setStreamKey("");
        }}
        className="button"
      >
        reset stream key
      </div>
    </div>
  );
};

export default Admin;
