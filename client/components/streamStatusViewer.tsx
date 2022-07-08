import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { disableStreamSync, syncStreamPlaybackID, syncStreamStatus } from "../lib/firebase";
import { generateStreamLink } from "../lib/server-api";
import useCurrentStreamName from "../stores/useCurrentStreamName";


const StreamStatus: React.FunctionComponent = () => {
  const id = useCurrentStreamName();
  const [streamStatus, setStreamStatus] = useState<string>("loading");
  const [playbackID, setPlaybackID] = useState<string | undefined>();

  useEffect(() => {
    console.log("Starting to sync with player ID as: ", id);
    if (id) {
      syncStreamStatus(id as string, (status) => setStreamStatus(status));
      syncStreamPlaybackID(id as string, (playbackID) => setPlaybackID(playbackID));
    }
    return () => disableStreamSync(id as string);
  }, [id]);

  return (
    <div>
      <h1>
        {id} is .. {streamStatus}
      </h1>
      <h2 style={{ width: "40ch" }}>
        This is a prototype of IS THIS THING ON.
        <br/> Watch the live stream below. Interact with elements on the page to gain energy
      </h2>
      <div>{streamStatus == "active" && playbackID && <ReactPlayer url={generateStreamLink(playbackID)} controls={true} />}</div>
    </div>
  );
};


export default StreamStatus;