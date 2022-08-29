import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { getRoomsWhereUserISAdmin } from "../lib/firestore";
import { getStreamKey, resetRoom } from "../lib/server-api";

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
    <div className="stack">
      {rooms.map((r) => (
        <RoomAdminUI roomID={r.roomName} key={r.roomName + "-adminView"} uid={uid} />
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
    <div className="stack">
      <div> admin view for room : {roomID} </div>
      <div>stream key: {streamKey }</div>
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
