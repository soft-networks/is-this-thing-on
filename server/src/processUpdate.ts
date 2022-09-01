import { RequestHandler } from "express";
import { getRoomIDFromMUXID, writePlaybackIDToDB, writeStreamStateToDB } from "./firestore-api.js";
import { logInfo, logError, logUpdate } from "./logger.js";
import { getPlaybackIDFromMuxData } from "./muxAPI.js";

export const muxUpdateWasReceived : RequestHandler =  async (req, res) => {
  logInfo("** [POST] mux-hook ")
  try {
    if (!req.body && req.body.type) {
      logError("Recevied webhook with no request body or info");
      throw new Error("Couldn't find request body or info in Mux hook");
    }
    let type = req.body.type
    if (type == "video.live_stream.idle" ) {
      let roomID = await getRoomIDFromMUXID(req.body.data.id);
      logUpdate("> Stream went idle");
      writeStreamStateToDB(roomID, "idle");
      return res.status(200).send("Thanks for the update :) ");
    }
    if (type == "video.live_stream.active") {
      let roomID = await getRoomIDFromMUXID(req.body.data.id);
      let playbackID = getPlaybackIDFromMuxData(req.body.data);
      logUpdate("> Stream went active, with playbackID " + playbackID);
      writeStreamStateToDB(roomID, "active");
      if (playbackID) writePlaybackIDToDB(roomID, playbackID);
      return res.status(200).send("Thanks for the update :) ");
    }
    logInfo("> Ignored hook of " + type);
    return res.status(200).send("Ignored, but appreciated anyway");
  } catch (e) {
    let em = (e as Error).message;
    logError(em);
    return res.status(500).send(em);
  }
}