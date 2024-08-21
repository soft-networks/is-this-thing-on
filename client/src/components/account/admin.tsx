import { getStreamKey, resetRoom } from "../../lib/server-api";
import { useEffect, useState } from "react";

import { app } from "../../lib/firestore/init";
import { getAuth } from "firebase/auth";
import { getRoomsWhereUserISAdmin } from "../../lib/firestore";

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
  }, [auth.currentUser, uid]);

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
          playbackID={r.streamPlaybackID}
          key={r.roomName + "-adminView"}
          userToken={state.userToken || ""}
        />
      ))}
    </div>
  ) : (
    <div> you are not the admin for any rooms</div>
  );
};

const RoomAdminUI: React.FC<{
  roomID: string;
  playbackID?: string;
  userToken: string;
}> = ({ roomID, playbackID, userToken }) => {
  return (
    <div className="stack padded border-thin">
      <div>
        <span>{roomID}</span>
      </div>
      <div>
        Stream Call ID: <br />{" "}
        <span className="contrastFill">{playbackID || "N/A"}</span>
      </div>
      <div
        onClick={() => {
          resetRoom(userToken, roomID);
        }}
        className="button"
      >
        reset stream key
      </div>
    </div>
  );
};

export default Admin;
