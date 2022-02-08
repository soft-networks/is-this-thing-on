import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player/lazy'
import { disableStreamSync, syncStreamPlaybackID, syncStreamStatus } from '../../lib/firebase';

//https://stream.mux.com/{PLAYBACK_ID}.m3u8  

const generateStreamLink  = ( playbackID: string) => {
  return `https://stream.mux.com/${playbackID}.m3u8`
}


const StreamPage: NextPage = () => {
  const router = useRouter();
  const {id} = router.query;

  const [streamStatus, setStreamStatus] = useState<string>("un-initialized");
  const [playbackID, setPlaybackID] = useState<string | undefined>();

  useEffect(() => {
    console.log("Starting to sync with player ID as: ", id);
    if (id) {
      syncStreamStatus(id as string, (status) =>  setStreamStatus(status));
      syncStreamPlaybackID(id as string, (playbackID) => setPlaybackID(playbackID));
    }
    return () => disableStreamSync(id as string);
  }, [id]);

  return (
    <div>
      <h3> {streamStatus} </h3>
      <div>
        { streamStatus == "active" && playbackID && <ReactPlayer url={generateStreamLink(playbackID)} />}
      </div>
    </div>
  )
}

export default StreamPage;