import { logError, logWarning } from "./logger.js";

import { RequestHandler } from "express";
import { client } from "./streamAPI.js";
import { firebaseAuth } from "./firebase-init.js";
import { isAdminForAnyRoom } from "./firestore-api.js";

/**
 * Middleware to ensure that the caller has provided admin credentials.
 * An admin is any user who has been assigned as an admin to any room in Firestore.
 */
export const verifyThingAdmin: RequestHandler = async (req, res, next) => {
    const bearer = req.headers.authorization;

    if (!bearer) {
        logError("No ID token provided for request");
        return res.sendStatus(403);
    }

    const parts = bearer.split("Bearer ");
    if (parts.length <= 1) {
        logError("Invalid ID token provided for request");
        return res.sendStatus(403);
    }

    const idToken = parts[1];

    try {
        const decodedToken = await firebaseAuth.verifyIdToken(idToken)
        const uid = decodedToken.uid;
    
        const isAdmin = await isAdminForAnyRoom(uid);
        if (isAdmin) {
            return next();
        } else {
            logError(`User with ID ${uid} is not an admin for any rooms`);
        }
    } catch (err) {
        logError(`Failed to verify auth token: ${err}`)
    }

    return res.sendStatus(403);
  }

  export const verifyStreamIdentity: RequestHandler = async (req, res, next) => {
    const signature = req.headers["x-signature"] as string;
    const valid = signature && client.verifyWebhook(JSON.stringify(req.body), signature);
    
    if (!valid) {
        logWarning("Received stream webhook with invalid signature");
        return res.sendStatus(401);
    }

    return next();
  }