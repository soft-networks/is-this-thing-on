import "dotenv/config";
import express, { Application, RequestHandler } from "express";
import { createServer } from "http";
import { getRoomIDFromMUXID, getStreamKey,  manageEnergyTxInDB,  managePresenceInDB,  resetMuxFirestoreRelationship,  transactionProcessor,  writeNewStreamToDB, writePlaybackIDToDB, writeStreamStateToDB } from "./firestore-api.js";

import bodyParser from "body-parser"
import STREAM_NAMES from "../../common/streamData.js";
import { logError, logInfo, logUpdate } from "./logger.js";
import { muxCreateStream, getPlaybackIDFromMuxData, muxAuthHelper } from "./muxAPI.js";


const app: Application = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 4000;
const httpServer = createServer(app);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.get("/", (req, res) => {
  res.send("Server?");
});
app.get("/stream-key/:id", async (req, res) => {
  const roomID = req.params.id;
  logInfo("** [GET] /stream-key/" + roomID);
  if (!roomID) {
    res.status(400).send("No stream name provided");
  }
  if (!STREAM_NAMES.includes(roomID)) {
    res.status(400).send("Stream name not valid");
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
  }
  res.send({key: key})
 
});
app.get("/reset-room/:id", async (req,res) => {
  try {
    const roomID = req.params.id;
    await resetMuxFirestoreRelationship(roomID);
    // TODO: Delete MUX Livestream asset as well.
    res.status(200).send("Reset");
  } catch (e) {
    console.log((e as Error).message)
    res.status(500).send("Error resetting room")
  } 
})

//Listening for hooks
app.post("/mux-hook", muxAuthHelper, async (req, res) => {
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
});

httpServer.listen(port, () => {
  logUpdate(`Server is LIVE on port ${port}`);
});

managePresenceInDB();
// manageEnergyTxInDB();
transactionProcessor();

