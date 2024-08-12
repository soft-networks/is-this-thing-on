import { RequestHandler } from 'express';
import { StreamClient } from '@stream-io/node-sdk';
import { logError } from './logger.js'

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