import Mux, { CreateLiveStreamParams } from "@mux/mux-node";
import auth from "basic-auth";
import { Request, RequestHandler } from "express";
import { logError, logInfo } from "./logger.js";

const { Video } = new Mux(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRET);
import { getStreamKey, writeNewStreamToDB } from "./firestore-api.js";

export const createAndReturnStreamKey : RequestHandler = async (req, res) => {
  const roomID = req.params.id;
  logInfo("** [GET] /stream-key/" + roomID);
  if (!roomID) {
    res.status(400).send("No stream name provided");
    return;
  }
  const cachedKey = await getStreamKey(roomID);
  let key; 
  try {
    if (!cachedKey) {
      const {streamKey, muxID} = await muxCreateStream();
      if (streamKey == undefined || muxID == undefined) {
        throw Error(`MUX Didn't create the stream key and ID for ${roomID}`);
      } 
      await writeNewStreamToDB(roomID, muxID, streamKey);
      key = streamKey;
    } else {
      key = cachedKey;
    }
  } catch(e){
    logError((e as Error).message);
    res.status(500).send("Error creating stream key");
    return;
  }
  res.send({key: key});
}
export const muxCreateStream = async () => {
  const { stream_key, id } = await Video.LiveStreams.create({
    latency_mode: "low",
    playback_policy: "public",
    new_asset_settings: { playback_policy: "public" },
     
  } as unknown as CreateLiveStreamParams);
  return { streamKey: stream_key, muxID: id};
};
export const muxAuthHelper: RequestHandler = (req, res, next) => {
  const user  = auth(req);
  if (
    !user ||
    !user.name ||
    !user.pass ||
    user.name !== process.env.MUX_USER ||
    user.pass !== process.env.MUX_PASSWORD
  ) {
    res.set("WWW-Authenticate", "Basic realm=Authorization Required");
    return res.status(401).send();
  }
  return next();
};
export const getPlaybackIDFromMuxData = ( data: any) => {
  const playbackIDs =  data["playback_ids"];
  if (playbackIDs && playbackIDs[0]) {
    return playbackIDs[0].id
  }
  return undefined
}
