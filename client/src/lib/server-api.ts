const USE_PROD_SERVER = process.env.NEXT_PUBLIC_USE_PROD_SERVER != "false";
const SERVER_URL = USE_PROD_SERVER
  ? "https://isto-server.fly.dev"
  : "http://localhost:4000";

const STREAM_ENDPOINT = `${SERVER_URL}/stream`;
const STREAMS_KEY_ENDPOINT = `${SERVER_URL}/stream-key`;

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

export const resetRoom = async (adminToken: string, roomID: string) => {
  return fetchResponse(adminToken, SERVER_URL + "/reset-room/" + roomID);
};

interface StreamAdminCredentials {
  userId: string;
  token: string;
  call: ServerCallResponse;
}

export const getStreamAdminCredentials: (
  adminToken: string,
  roomID: string,
) => Promise<StreamAdminCredentials> = async (adminToken, roomID) => {
  const streamTokenResponse = await fetchResponse(
    adminToken,
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
