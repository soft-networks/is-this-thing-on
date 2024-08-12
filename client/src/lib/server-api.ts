const USE_PROD_SERVER = process.env.NEXT_PUBLIC_USE_PROD_SERVER != "false";
const SERVER_URL = USE_PROD_SERVER
  ? "https://isto-server.fly.dev"
  : "http://localhost:4000";

const STREAM_ENDPOINT = `${SERVER_URL}/stream`;
const STREAMS_KEY_ENDPOINT = `${SERVER_URL}/stream-key`;

export const generateStreamLink = (playbackID: string) => {
  return `https://stream.mux.com/${playbackID}.m3u8`;
};

const fetchResponse = async (endpoint: string) => {
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(
      `Request to ${endpoint} failed with status code ${response.status}`,
    );
  }
  return response;
};

export const getStreamKey = async (streamName: string) => {
  try {
    // Imagine that this getStreamKey has a secret key like
    // let secretKey = hash(process.env.secretKey)
    //Then fetchResponse(/streamName, )
    const streamKeyResponse = await fetchResponse(
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

export const resetRoom = async (roomID: string) => {
  await fetch(SERVER_URL + "/reset-room/" + roomID);
};

interface StreamAdminCredentials {
  userId: string;
  token: string;
}

export const getStreamAdminCredentials: () => Promise<StreamAdminCredentials> =
  async () => {
    const streamTokenResponse = await fetchResponse(`${STREAM_ENDPOINT}/token`);
    const resp = await streamTokenResponse.json();
    return {
      userId: resp["userId"],
      token: resp["token"],
    } as StreamAdminCredentials;
  };
