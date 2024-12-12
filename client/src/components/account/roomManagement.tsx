import { useCallback, useEffect, useMemo, useState } from "react";
import updateOrCreateRoom from "../../lib/firestore/updateRoom";
import useGlobalRoomsInfoStore from "../../stores/globalRoomsInfoStore";
import { getRoomsWhereUserISAdmin } from "../../lib/firestore/room";
import Link from "next/link";
import { useGlobalAdminStore } from "../../stores/globalUserAdminStore";


const RoomManagement: React.FC<{uid: string}> = ({ uid }) => {
    return (
        <div className="stack padded border-thin lightFill">
            <CreateRoom uid={uid} />
            <UserRoomManager uid={uid} />
        </div>
    );
}

const CreateRoom: React.FC<{
    uid: string;
  }> = ({ uid }) => {
    const [showForm, setShowForm] = useState(false);
  
    return (
      <div className="stack:s-1 lightFill padded:s-1 border-thin align-start">
        <div className="button padded:s-1 whiteFill border-thin contrastFill:hover inline" onClick={() => setShowForm(!showForm)}>{showForm ? "Close" : "Create Room"}</div >
        {showForm && <RoomForm uid={uid} />}
      </div>
    );
  };
  

const UserRoomManager: React.FC<{uid: string}> = ({ uid }) => {

  const adminFor = useGlobalAdminStore(useCallback((s) => s.adminFor, []));
  const rooms = useGlobalRoomsInfoStore(useCallback((s) => s.rooms, []));

  const myRooms = useMemo(() => {
    return adminFor.map((r) => rooms[r]);
  }, [adminFor, rooms]);

  return adminFor.length > 0 ? (
    <div className="stack padded border-thin lightFill">
      <div className="stack:s-1">
        <em>Rooms you manage</em>
        {myRooms.map((r) => (
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

  const UpdateRoom: React.FC<{
    roomID: string;
    playbackID?: string;
    uid: string;
    room?: RoomSummary;
  }> = ({ uid, room }) => {
    return (
      <div className="stack padded border-thin">
        <RoomForm uid={uid} room={room} />
      </div>
    );
  };
  

const RoomForm: React.FC<{
    uid: string;
    room?: RoomSummary;
  }> = ({ uid, room }) => {
    const [roomName, setRoomName] = useState(room?.roomName || "");
    const [roomId, setRoomId] = useState(room?.roomID || "");
    const [roomColor, setRoomColor] = useState(room?.roomColor || "#000000");
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const roomData = {
        roomName,
        roomId,
        roomColor,
        adminUserId: uid
      };
      await updateOrCreateRoom(roomData);
      setRoomName("");
      setRoomId("");
      setRoomColor("#000000");
    };
  
    return (
      <form onSubmit={handleSubmit} className="stack">
        <div>
          <div>
            <label htmlFor="roomId">Room ID: </label>
            {!room?.roomID ? <input
              type="text"
              id="roomId"
              onChange={(e) => setRoomId(e.target.value)}
              required
              placeholder="Room ID"
            /> : <span>{roomId}</span>}
          </div>
          <label htmlFor="roomName">Room Name: </label>
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
          <label htmlFor="roomColor">Room Color: </label>
          <input
            type="color"
            id="roomColor"
            value={roomColor}
            onChange={(e) => setRoomColor(e.target.value)}
            required
            placeholder="Room Color"
          />
        </div>
        <div className="horizontal-stack">
          <div className="padded:s-1 whiteFill border greenFill:hover cursor:pointer" onClick={handleSubmit}>{room ? "Update" : "Create"} Room</div>
          {room && <Link href={`/${room.roomID}`} className="whiteFill greenFill:hover border padded:s-1">View Room</Link>}
        </div>
        
      </form>
    );
  };

  
  export default RoomManagement;