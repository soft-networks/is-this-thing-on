import { useEffect, useState } from "react";

import { getRoomsWhereUserISAdmin } from "../../lib/firestore";
import { getStreamKey, resetRoom } from "../../lib/server-api";
import updateOrCreateRoom from "../../lib/firestore/updateRoom";

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
      <div className="stack:s-1">
        <CreateRoom uid={uid} />
      </div>
      <div className="stack:s-1">
      <em>Rooms you manage</em>
      {rooms.map((r) => (
        <RoomAdminUI
          roomID={r.roomID}
          playbackID={r.streamPlaybackID}
          key={r.roomName + "-adminView"}
          uid={uid}
        />
      ))}
      </div>
    </div>
  ) : (
    <div> you are not the admin for any rooms</div>
  );
};

const CreateRoom: React.FC<{
  uid: string;
}> = ({ uid }) => {
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [roomColor, setRoomColor] = useState("#000000");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const roomData = {
      roomName,
      roomId,
      roomColor,
      adminUserId: uid
    };
    await updateOrCreateRoom(roomData);
    // Reset form
    setRoomName("");
    setRoomId("");
    setRoomColor("#000000");
  };

  return (
    <form onSubmit={handleSubmit} className="stack:s-1">
      <div>
        <label htmlFor="roomName">Room Name:</label>
        <input
          type="text"
          id="roomName"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
          placeholder="Room Name"
        />
      </div>
      <div>
        <label htmlFor="roomId">Room ID:</label>
        <input
          type="text"
          id="roomId" 
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          required
          placeholder="Room ID"
        />
      </div>
      <div>
        <label htmlFor="roomColor">Room Color:</label>
        <input
          type="color"
          id="roomColor"
          value={roomColor}
          onChange={(e) => setRoomColor(e.target.value)}
          required
          placeholder="Room Color"
        />
      </div>
      <button type="submit" className="button">Create Room</button>
    </form>
  );
};

const RoomAdminUI: React.FC<{
  roomID: string;
  playbackID?: string;
  uid: string;
}> = ({ roomID, playbackID, uid }) => {
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
          resetRoom(roomID);
        }}
        className="button"
      >
        reset stream key
      </div>
    </div>
  );
};

export default Admin;
