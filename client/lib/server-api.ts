export const SERVER_URL = "http://localhost:4000";

export const STREAM_NAME_ENDPOINT = `${SERVER_URL}/stream-names`;

export const STREAMS_ENDPOINT = `${SERVER_URL}/stream`;

export const STREAMS_KEY_ENDPOINT = `${SERVER_URL}/stream-key`;

export const generateStreamLink = (playbackID: string) => {
  //https://stream.mux.com/{PLAYBACK_ID}.m3u8
  return `https://stream.mux.com/${playbackID}.m3u8`;
};

const fetchResponse = async (endpoint: string) => {
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Request to ${endpoint} failed with status code ${response.status}`);
  } 
  return response
}

//Fetch stream names from server and cache them
export const getStreamNames = async () => {
  try {
    const streamNamesResponse = await fetchResponse(STREAM_NAME_ENDPOINT);
    const streamNames = await streamNamesResponse.json();
    return streamNames;
  } catch (e) {
    console.log("Error getting stream names", (e as Error).message);
    return undefined;
  }
};

export const getStreamKey = async (streamName: string) => {
  try {
    const streamKeyResponse = await fetchResponse(`${STREAMS_KEY_ENDPOINT}/${streamName}`);
    console.log(streamKeyResponse);
    const streamKeys = await streamKeyResponse.json();
    if (streamKeys["key"]){
      return streamKeys["key"];
    }
    return undefined;
  } catch (e) {
    console.log("Error getting stream names", (e as Error).message);
    return undefined;
  }
};