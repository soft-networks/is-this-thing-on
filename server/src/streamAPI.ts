import { getStreamKey, writePlaybackIDToDB } from './firestore-api';
import { logError, logInfo, logUpdate } from './logger.js'

import { RequestHandler } from 'express';
import { StreamClient } from '@stream-io/node-sdk';
import { randomUUID } from 'crypto';

const apiKey = process.env.STREAM_API_KEY!;
const apiSecret = process.env.STREAM_API_SECRET!;
const client = new StreamClient(apiKey, apiSecret);

const adminUserId = process.env.STREAM_ADMIN_USER_ID!;

export const createStreamAdminToken: RequestHandler = (req, res) => {
    try {
        // exp is optional (by default the token is valid for an hour)
        const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;
        const token = client.createToken(adminUserId, exp);
        res.send({ userId: adminUserId, token});
    } catch (e) {
        logError((e as Error).message);
        res.status(500).send("Error creating stream admin token");
    }
}

export const getOrCreateStreamCall: RequestHandler = async (req, res) => {
    const roomId = req.params.id;
    logInfo("** [GET] /stream/call/" + roomId);
  
    if (!roomId) {
        res.status(400).send("No room ID provided");
        return;
    }
  
    let key = await getStreamKey(roomId);
  
    if (!key) {
        try {
            key = generateNewStreamCall(roomId);
        } catch(e){
            logError((e as Error).message);
            res.status(500).send("Error creating stream key");
            return;
        }
    }
    
    res.send({key: key});
}

const generateNewStreamCall = async (roomId: string) => {
    const callId = randomUUID();
    const call = client.video.call('livestream', callId);

    // TODO: Determine best settings to maximize latency and quality?
    const resp = await call.create();
    
    if (!resp.created) {
        throw Error(`Stream with random ID ${callId} was not created for ${roomId}`);
    }

    logUpdate(`Tying Stream Call ID ${callId} to roomID ${roomId}`)
    await writePlaybackIDToDB(roomId, callId);
    return callId;
}