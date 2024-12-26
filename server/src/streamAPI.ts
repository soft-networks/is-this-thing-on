import {
  StreamClient,
  VideoGetOrCreateCallResponse,
} from "@stream-io/node-sdk";
import {
  connectStreamRoomDB,
  getRoom,
  getRoomIDFromStreamCallID,
  getRoomStatusFromDB,
  writeHlsPlaylistIDToDB,
  writePlaybackIDToDB,
  writeRecordingToDB,
  writeStreamStateToDB,
} from "./firestore-api.js";
import { logError, logInfo, logUpdate } from "./logger.js";

import { RequestHandler } from "express";
import { randomUUID } from "crypto";

// ... existing imports ...

const apiKey = process.env.STREAM_API_KEY!;
const apiSecret = process.env.STREAM_API_SECRET!;
const client = new StreamClient(apiKey, apiSecret);

const adminUserId = process.env.STREAM_ADMIN_USER_ID!;

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

const manualRoomIDs = ["exonomo", "grass", "coffee", "ideas", "references"];

// Update the streamUpdateWasReceived function
export const streamUpdateWasReceived: RequestHandler = async (req, res) => {
  logInfo("** [POST] getStream HOOK");
  try {
    if (!req.body || !req.body.type) {
      throw Error("Badly formatted webhook");
    }
    const hook = req.body;
    const eventType = hook.type;
    if (eventType == "call.live_started") {
      const id = hook.call_cid;
      const callID = id.split(":")[1];
      logInfo(`Received ${eventType} for call ${callID}`);
      logUpdate("> Stream went active");
      let roomID = await getRoomIDFromStreamCallID(callID);
      const result = await writeStreamStateToDB(roomID, "active");
      return res.status(200).send("Thanks for the update :) ");
    }
    if (
      eventType == "call.session_started" ||
      eventType == "call.session_participant_joined"
    ) {
      const id = hook.call_cid;
      const callID = id.split(":")[1];
      logInfo(`Received ${eventType} for call ${callID}`);

      const call = await client.video.call("livestream", callID).get();
      if (call.call.backstage) {
        logInfo(
          "Ignoring session started event because call is in backstage mode."
        );
      } else {
        logUpdate("> Stream went active");
        let roomID = await getRoomIDFromStreamCallID(callID);
        await writeStreamStateToDB(roomID, "active");
        return res.status(200).send("Thanks for the update :) ");
      }
    }
    if (eventType == "call_ended" || eventType == "call.session_ended") {
      // NOTE: There is no live_ended status, so these events are the best proxies for when the streamer is offline.
      //
      // - call.session_ended: Occurs when participant leaves the call or closes their tab.
      // - call.ended: Occurs when the call itself is ended through the Stream UI.
      // - custom: Custom event emitted when clicking the Stop Livestreaming button in client.
      //
      const id = hook.call_cid;
      const callID = id.split(":")[1];
      logInfo(`Received ${eventType} for call ${callID}`);
      logUpdate("> Stream went idle");
      let roomID = await getRoomIDFromStreamCallID(callID);
      let roomStatus = await getRoomStatusFromDB(roomID);
      if (roomStatus == "archive" || manualRoomIDs.includes(roomID)) {
        logInfo(`Room ${roomID} is in archive / manual, ignoring idle event`);
        return res.status(200).send("Thanks for the update :) ");
      }
      await writeStreamStateToDB(roomID, "idle");
      return res.status(200).send("Thanks for the update :) ");
    }
    if (eventType == "custom" && hook.custom.type == "STOP_LIVE") {
      const callID = hook.custom.callId;
      logInfo(`Received ${eventType} for call ${callID}`);
      logUpdate("> Stream went idle");
      let roomID = await getRoomIDFromStreamCallID(callID);
      await writeStreamStateToDB(roomID, "idle");
      return res.status(200).send("Thanks for the update :) ");
    }
    if (eventType == "call.recording_ready") {
      // const callID = hook.call_cid; 
      const livestreamID = hook.call_cid;
      const callID = livestreamID.split(":")[1];
      const roomID = await getRoomIDFromStreamCallID(callID);
      console.log("recording ready for roomID: ", hook);
      const recording = hook.call_recording;
      if (recording) {
        const ref = await writeRecordingToDB(roomID, recording.url, recording.start_time, recording.end_time);
        logUpdate(`Wrote recording to DB for room ${roomID} with ref ${ref.id}`);
      } else {
        logError(`Recording was ready but didn't exist`);
      }
      
      return res.status(200).send("Thanks for the update :) ");
    }
    if (eventType == "call.hls_broadcasting_started") {
        const livestreamID = hook.call_cid;
      const callID = livestreamID.split(":")[1];
      const roomID = await getRoomIDFromStreamCallID(callID);
      console.log("HLS recording started for roomID: ", hook);

      const playlist_url = hook.hls_playlist_url;
      if (playlist_url) {
        await writeHlsPlaylistIDToDB(roomID, playlist_url);
        logUpdate(`Wrote HLS playlist to DB for room ${roomID}`);
      } else {
        logError(`HLS Playlist was started but didn't exist`);
      }
      
      return res.status(200).send("Thanks for the update :) ");
    }
    logInfo("> Ignored hook of " + eventType);
    return res.status(200).send("Ignored, but appreciated anyway");
  } catch (e) {
    logError(getErrorMessage(e));
    res.status(500).send("Error verifying webhook");
  }
};

export const createStreamAdminToken: RequestHandler = async (req, res) => {
  const roomId = req.params.id;

  if (!roomId) {
    res.status(400).send("No room ID provided");
    return;
  }
  console.log("> Creating stream admin token for room " + roomId);
  try {
    // exp is optional (by default the token is valid for an hour).
    // set exp to be 36 hours.
    const exp = Math.round(new Date().getTime() / 1000) + 60 * 60 * 36;
    const token = client.createToken(adminUserId, exp);
    console.log("token: ", token);
    const streamCall = await getOrCreateCall(roomId);
    console.log("streamCall: ", streamCall);
    await connectStreamRoomDB(roomId, streamCall.id);
    console.log("returning token to client should be written to db")
    res.send({ userId: adminUserId, call: streamCall, token });
  } catch (e) {
    logError(getErrorMessage(e));
    res.status(500).send("Error creating stream admin token");
  }
};

export const getOrCreateStreamCall: RequestHandler = async (req, res) => {
  const roomId = req.params.id;

  if (!roomId) {
    res.status(400).send("No room ID provided");
    return;
  }

  try {
    const callId = getOrCreateCall(roomId);
    res.send({ callId: callId });
  } catch (e) {
    logError(getErrorMessage(e));
    res.status(500).send("Error creating Stream call");
    return;
  }
};

const getOrCreateCall = async (roomId: string) => {
  const roomData = await getRoom(roomId);
  let callId = roomData?.["stream_playback_id"];

  let callDetails;

  if (!callId) {
    [callId, callDetails] = await generateNewStreamCall(roomId);
  } else {
    callDetails = await client.video.call("livestream", callId).get();
  }

  // Set expiration to 36 hours
  const exp = Math.round(new Date().getTime() / 1000) + 36 * 60 * 60;

  return {
    id: callId,
    rtmpAddress: callDetails.call.ingress.rtmp.address,
    rtmpStreamKey: client.createToken(adminUserId, exp),
  };
};

const generateNewStreamCall = async (
  roomId: string
): Promise<[string, VideoGetOrCreateCallResponse]> => {
  const callId = randomUUID();
  const call = client.video.call("livestream", callId);

  // TODO: Determine best settings to maximize latency and quality?
  const resp = await call.create({
    data: {
      created_by_id: adminUserId,
      settings_override: {
        backstage: {
          enabled: true,
          join_ahead_time_seconds: 60 * 60, // Allow people to join the call up to an hour beforehand
        },
      },
    },
  });

  if (!resp.created) {
    throw Error(
      `Stream with random ID ${callId} was not created for ${roomId}`
    );
  }

  logUpdate(`Tying Stream Call ID ${callId} to roomID ${roomId}`);
  await writePlaybackIDToDB(roomId, callId);
  return [callId, resp];
};

interface StreamCallResponse {
  id: string;
  rtmpAddress: string;
  rtmpStreamKey: string;
}
