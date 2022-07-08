import ReactPlayer from "react-player";
import { generateStreamLink } from "../lib/server-api";
import { useRoomStore } from "../stores/roomStore";


const StreamStatus: React.FunctionComponent = () => {
  const roomInfo = useRoomStore(state => state.roomInfo);
  const roomName = useRoomStore(state => state.currentRoomID);
  return (
    <div>
      <h1>
        {roomName} is .. {roomInfo?.streamStatus}
      </h1>
      <h2 style={{ width: "40ch" }}>
        This is a prototype of IS THIS THING ON.
        <br /> Watch the live stream below. Interact with elements on the page to gain energy
      </h2>
      <div>
        {roomInfo && roomInfo.streamStatus == "active" && roomInfo.streamPlaybackID && (
          <ReactPlayer url={generateStreamLink(roomInfo.streamPlaybackID)} controls={true} />
        )}
      </div>
    </div>
  );
};


export default StreamStatus;