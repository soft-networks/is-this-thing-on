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
    return streamKeys["key"];
  } catch (e) {
    console.log("Error getting stream names", (e as Error).message);
    return undefined;
  }
};

interface ServerCallResponse {
  id: string;
  rtmpAddress: string;
  rtmpStreamKey: string;
}

export const getStreamCall = async (
  streamName: string,
): Promise<ServerCallResponse | undefined> => {
  try {
    const resp = await fetchResponse(`${STREAM_ENDPOINT}/${streamName}/call`);
    const json = await resp.json();

    return {
      id: json["callId"],
      rtmpAddress: json["rtmpAddress"],
      rtmpStreamKey: json["rtmpStreamKey"],
    };
  } catch (e) {
    console.log("Error getting stream call", (e as Error).message);
    return undefined;
  }
};

export const resetRoom = async (roomID: string) => {
  await fetch(SERVER_URL + "/reset-room/" + roomID);
};

interface StreamAdminCredentials {
  userId: string;
  token: string;
  call: ServerCallResponse;
}

export const getStreamAdminCredentials: (
  roomID: string,
) => Promise<StreamAdminCredentials> = async (roomID) => {
  const streamTokenResponse = await fetchResponse(
    `${STREAM_ENDPOINT}/${roomID}/token`,
  );
  const resp = await streamTokenResponse.json();
  return {
    userId: resp["userId"],
    token: resp["token"],
    call: {
      id: resp["call"]["id"],
      rtmpAddress: resp["call"]["rtmpAddress"],
      rtmpStreamKey: resp["call"]["rtmpStreamKey"],
    },
  } as StreamAdminCredentials;
};
