import { useState } from "react";
import updateOrCreateRoom from "../../lib/firestore/updateRoom";


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
  
  const UpdateRoom: React.FC<{
    roomID: string;
    playbackID?: string;
    uid: string;
    room?: RoomInfo;
  }> = ({ uid, room }) => {
    return (
      <div className="stack padded border-thin">
        <RoomForm uid={uid} room={room} />
      </div>
    );
  };
  

const RoomForm: React.FC<{
    uid: string;
    room?: RoomInfo;
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
    };
  
    return (
      <form onSubmit={handleSubmit} className="stack:s-1">
        <div>
          <div>
            <label htmlFor="roomId">Room ID:</label>
            {!room?.roomID ? <input
              type="text"
              id="roomId"
              onChange={(e) => setRoomId(e.target.value)}
              required
              placeholder="Room ID"
            /> : <span>{roomId}</span>}
          </div>
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
        <button type="submit" className="button">{room ? "Update" : "Create"} Room</button>
      </form>
    );
  };

  
  export {CreateRoom, UpdateRoom};