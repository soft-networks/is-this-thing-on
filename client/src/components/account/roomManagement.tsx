import { useCallback, useEffect, useMemo, useState } from "react";
import updateOrCreateRoom from "../../lib/firestore/updateRoom";
import useGlobalRoomsInfoStore from "../../stores/globalRoomsInfoStore";
import { getRoomsWhereUserISAdmin } from "../../lib/firestore/room";
import Link from "next/link";
import { useGlobalAdminStore } from "../../stores/globalUserAdminStore";


const RoomManagement: React.FC<{ uid: string }> = ({ uid }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple client-side password check
    if (password.toLocaleLowerCase() === "vanilla") { // You can change this password
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
      setPassword("");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="stack padded border:gray lightFill">
        <em className="inline-block">want to create a room?</em>
        <form onSubmit={handlePasswordSubmit} className="stack:s-1">
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="first..what is the best flavor of ice cream?"
            className="padded:s-1 border-thin"
          />
          <div className="button padded:s-1 whiteFill greenFill:hover border inline-block" onClick={handlePasswordSubmit}>
            Submit
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="padded border:gray stack lightFill">
      <em className="inline-block">rooms you manage</em>
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
    <>
      <div className="button padded:s-1 whiteFill greenFill:hover border-thin inline-block" onClick={() => setShowForm(!showForm)}>{showForm ? "Close" : "Create Room"}</div>
      {showForm && <div className="stack padded whiteFill  border-thin"><RoomForm uid={uid} onSuccess={() => setShowForm(false)} /></div>}
    </>
  );
};


const UserRoomManager: React.FC<{ uid: string }> = ({ uid }) => {

  const adminFor = useGlobalAdminStore(useCallback((s) => s.adminFor, []));
  const rooms = useGlobalRoomsInfoStore(useCallback((s) => s.rooms, []));

  const myRooms = useMemo(() => {
    return adminFor.map((r) => rooms[r]);
  }, [adminFor, rooms]);

  return adminFor.length > 0 ? (
    <div className="stack:s-1">
      {myRooms.map((r) => (
        <UpdateRoom
          roomID={r.roomID}
          key={r.roomName + "-adminView"}
          uid={uid}
          room={r}
        />
      ))}
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
    <div className="stack padded faintWhiteFill">
      <RoomForm uid={uid} room={room} />
    </div>
  );
};


const RoomForm: React.FC<{
  uid: string;
  room?: RoomSummary;
  onSuccess?: () => void;
}> = ({ uid, room, onSuccess }) => {
  const [roomName, setRoomName] = useState(room?.roomName || "");
  const [roomId, setRoomId] = useState(room?.roomID || "");
  const [roomColor, setRoomColor] = useState(room?.roomColor || "#000000");
  const [roomWasRecentlyUpdated, setRoomWasRecentlyUpdated] = useState(false);

  useEffect(() => {
    if (roomWasRecentlyUpdated) {
      setTimeout(() => setRoomWasRecentlyUpdated(false), 1500);
    }
  }, [roomWasRecentlyUpdated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const roomData = {
      roomName,
      roomId,
      roomColor,
      adminUserId: uid
    };
    await updateOrCreateRoom(roomData);
    if (!room) {
      setRoomName("");
      setRoomId("");
      setRoomColor("#000000");
    }
    setRoomWasRecentlyUpdated(true);
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="stack:s1">
        <div className="stack:s-2">
          <div >Room ID</div>
          {!room?.roomID && <div className="caption">This is a short id, without spaces, that you cannot change. eg: &quot;soft&quot;, &quot;sarah&quot;, &quot;potato&quot;. It is used for your URL. eg: thing.tube/yourroomid</div>}
          {!room?.roomID ? <input
            type="text"
            id="roomId"
            onChange={(e) => setRoomId(e.target.value)}
            required
            placeholder="roomID"
          /> : <span>{roomId}</span>}
        </div>
        <div className="stack:s-3">
          <div>Room Name</div>
          <input
            type="text"
            id="roomName"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="fullWidth"
            required
          placeholder="Room Name"
        />
      </div>
      <div className="stack:s-3">
        <div>Room Color</div>
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
        {roomWasRecentlyUpdated && <div className="padded:s-2 border:gray">Room Updated!</div>}
        {!roomWasRecentlyUpdated && <div className="padded:s-2 whiteFill border-thin greenFill:hover cursor:pointer" onClick={handleSubmit}>{room ? "Update" : "Create"} Room</div>}
        {room && <Link href={`/${room.roomID}`} className="whiteFill greenFill:hover border-thin padded:s-2">View Room</Link>}
      </div>
    </form>
  );
};


export default RoomManagement;