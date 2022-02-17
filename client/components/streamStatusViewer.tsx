import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { disableStreamSync, syncStreamPlaybackID, syncStreamStatus } from "../lib/firebase";
import { generateStreamLink } from "../lib/server-api";
import useCurrentStreamName from "../useHooks/useCurrentStreamName";


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
      <h3>
        {id} is .. {streamStatus}
      </h3>
      <div>{streamStatus == "active" && playbackID && <ReactPlayer url={generateStreamLink(playbackID)} />}</div>
    </div>
  );
};


export default StreamStatus;