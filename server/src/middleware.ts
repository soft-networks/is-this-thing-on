import { RequestHandler } from "express";
import { firebaseAuth } from "./firebase-init.js";
import { isAdminForAnyRoom } from "./firestore-api.js";
import { logError } from "./logger.js";

export const verifyThingAdmin: RequestHandler = async (req, res, next) => {
    const bearer = req.headers.authorization;

    if (!bearer) {
        logError("No ID token provided for request");
        return res.send(403).json({error: "unauthorized"});
    }

    const parts = bearer.split("Bearer ");
    if (parts.length <= 1) {
        logError("Invalid ID token provided for request");
        return res.send(403).json({error: "unauthorized"});
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

    return res.send(403).json({error: "authorized"});
  }