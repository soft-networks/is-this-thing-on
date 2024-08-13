import { getAuth, getIdToken, User } from "firebase/auth";

import { useEffect, useState } from "react";

import { getRoomsWhereUserISAdmin } from "../../lib/firestore";
import { app } from "../../lib/firestore/init";
import { getStreamKey, resetRoom } from "../../lib/server-api";

const auth = getAuth(app);
/**
 * AdminView renders RoomAdminUI for each room that a user id admin for
 */
interface AdminViewProps {
  uid: string;
}
const Admin: React.FC<AdminViewProps> = ({ uid }) => {
  const [state, setState] = useState<{
    rooms?: RoomInfo[];
    userToken?: string;
  }>({});

  useEffect(() => {
    async function getRooms() {
      let [rooms, userToken] = await Promise.all([
        getRoomsWhereUserISAdmin(uid),
        auth.currentUser?.getIdToken(),
      ]);
      setState({ rooms, userToken });
    }
    getRooms();
  }, [uid]);

  return state.rooms && state.userToken ? (
    <div className="stack padded border-thin lightFill">
      <em>Rooms you manage</em>
      <p>
        All streams should point to <br />{" "}
        <span className="contrastFill">
          rtmps://global-live.mux.com:443/app
        </span>
      </p>
      {state.rooms.map((r) => (
        <RoomAdminUI
          roomID={r.roomID}
          key={r.roomName + "-adminView"}
          userToken={state.userToken || ""}
        />
      ))}
    </div>
  ) : (
    <div> you are not the admin for any rooms</div>
  );
};

const RoomAdminUI: React.FC<{ roomID: string; userToken: string }> = ({
  roomID,
  userToken,
}) => {
  let [streamKey, setStreamKey] = useState<string>();

  useEffect(() => {
    async function getSK() {
      let sk = await getStreamKey(userToken, roomID);
      setStreamKey(sk);
    }
    getSK();
  }, [roomID]);

  return (
    <div className="stack padded border-thin">
      <div>
        <span>{roomID}</span>
      </div>
      <div>
        stream key: <br /> <span className="contrastFill">{streamKey}</span>
      </div>
      <div
        onClick={() => {
          resetRoom(userToken, roomID);
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
