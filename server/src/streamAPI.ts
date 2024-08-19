import { connectStreamRoomDB, getRoom, getRoomIDFromStreamCallID, writePlaybackIDToDB, writeStreamStateToDB } from './firestore-api.js';
import { logError, logInfo, logUpdate } from './logger.js'

import { RequestHandler } from 'express';
import { StreamClient } from '@stream-io/node-sdk';
import { randomUUID } from 'crypto';

// ... existing imports ...




const apiKey = process.env.STREAM_API_KEY!;
const apiSecret = process.env.STREAM_API_SECRET!;
const client = new StreamClient(apiKey, apiSecret);

const adminUserId = process.env.STREAM_ADMIN_USER_ID!;

function getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message
    return String(error)
}

// Update the streamUpdateWasReceived function
export const streamUpdateWasReceived: RequestHandler = async (req, res) => {

    logInfo("** [POST] getStream HOOK")
    try {
        if (!req.body || !req.body.type) { 
            console.log(req.body);
            throw Error("Badly formatted webhook");
         }
        const hook = req.body;
        const eventType = hook.type;
        if (eventType == "call.live_started") {
            const id = hook.call_cid;
            const callID = id.split(':')[1];
            logInfo(`Received ${eventType} for call ${callID}`);
            logUpdate("> Stream went active");
            let roomID = await getRoomIDFromStreamCallID(callID);
            writeStreamStateToDB(roomID, "active");
            return res.status(200).send("Thanks for the update :) ");
        } 
        if (eventType == "call.recording_stopped" || eventType == "call.session_ended" || eventType == "call_ended") {
            // NOTE: There is no live_ended status, so these events are the best proxies for when the streamer is offline. 
            //
            // - call.recording_stopped: Occurs when livestream stops, if it was being recorded.
            // - call.session_ended: Occurs when streamer's tab is closed.
            // - call.ended: Occurs when the call itself is ended through the Stream UI.
            // - custom: Custom event emitted when clicking the Stop Live button in client.
            //
            const id = hook.call_cid;
            const callID = id.split(':')[1];
            logInfo(`Received ${eventType} for call ${callID}`);
            logUpdate("> Stream went idle");
            let roomID = await getRoomIDFromStreamCallID(callID);
            writeStreamStateToDB(roomID, "idle");
            return res.status(200).send("Thanks for the update :) ");
        }
        if (eventType == "custom" && hook.custom.type == "STOP_LIVE") {
            const callID = hook.custom.callId;
            logInfo(`Received ${eventType} for call ${callID}`);
            logUpdate("> Stream went idle");
            let roomID = await getRoomIDFromStreamCallID(callID);
            writeStreamStateToDB(roomID, "idle");
            return res.status(200).send("Thanks for the update :) ");
        }
        logInfo("> Ignored hook of " + eventType);
        console.log(hook);
        return res.status(200).send("Ignored, but appreciated anyway");
    } catch (e) {
        logError(getErrorMessage(e));
        res.status(500).send("Error verifying webhook");
    }
}

export const createStreamAdminToken: RequestHandler = async (req, res) => {
    const roomId = req.params.id;

    if (!roomId) {
        res.status(400).send("No room ID provided");
        return;
    }

    try {
        // exp is optional (by default the token is valid for an hour)
        const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;
        const token = client.createToken(adminUserId, exp);

        const callId = await getOrCreateCall(roomId);
        await connectStreamRoomDB(roomId, callId);
        res.send({ userId: adminUserId, callId, token });
    } catch (e) {
        logError(getErrorMessage(e));
        res.status(500).send("Error creating stream admin token");
    }
}

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
}

const getOrCreateCall = async (roomId: string) => {
    const roomData = await getRoom(roomId);
    let callId = roomData?.['stream_playback_id'];

    if (!callId) {
        callId = generateNewStreamCall(roomId);
    }

    return callId;
}

const generateNewStreamCall = async (roomId: string) => {
    const callId = randomUUID();
    const call = client.video.call('livestream', callId);

    // TODO: Determine best settings to maximize latency and quality?
    const resp = await call.create({ data: { created_by_id: adminUserId } });

    if (!resp.created) {
        throw Error(`Stream with random ID ${callId} was not created for ${roomId}`);
    }

    logUpdate(`Tying Stream Call ID ${callId} to roomID ${roomId}`)
    await writePlaybackIDToDB(roomId, callId);
    return callId;
}