export const USE_PROD_SERVER =
  process.env.NEXT_PUBLIC_USE_PROD_SERVER != "false";
export const SERVER_URL = USE_PROD_SERVER
  ? "https://isto-server.fly.dev"
  : "http://localhost:4000";
export const STREAM_NAME_ENDPOINT = `${SERVER_URL}/stream-names`;
export const STREAMS_ENDPOINT = `${SERVER_URL}/stream`;
export const STREAMS_KEY_ENDPOINT = `${SERVER_URL}/stream-key`;

export const generateStreamLink = (playbackID: string) => {
  return `https://stream.mux.com/${playbackID}.m3u8`;
};

const fetchResponse = async (adminToken: string, endpoint: string) => {
  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });
  if (!response.ok) {
    throw new Error(
      `Request to ${endpoint} failed with status code ${response.status}`,
    );
  }
  return response;
};

export const getStreamKey = async (adminToken: string, streamName: string) => {
  try {
    const streamKeyResponse = await fetchResponse(
      adminToken,
      `${STREAMS_KEY_ENDPOINT}/${streamName}`,
    );
    const streamKeys = await streamKeyResponse.json();
    if (streamKeys["key"]) {
      return streamKeys["key"];
    }
    return undefined;
  } catch (e) {
    console.log("Error getting stream names", (e as Error).message);
    return undefined;
  }
};

export const resetRoom = async (adminToken: string, roomID: string) => {
  return fetchResponse(adminToken, SERVER_URL + "/reset-room/" + roomID);
};
