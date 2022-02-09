import Mux from "@mux/mux-node";
import "dotenv/config";
import express, { Application, RequestHandler } from "express";
import { createServer } from "http";
import { getStreamKey, getStreamNameForID, writePlaybackIDToDB, writeStreamIDToDB, writeStreamKeyToDB, writeStreamStateToDB } from "./dbAPI.js";
import auth from "basic-auth";
import bodyParser from "body-parser"
import chalk from "chalk"
import STREAM_NAMES from "./streamNames.js";

const { Video } = new Mux(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRET);

const app: Application = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 4000;

const httpServer = createServer(app);
const TEST_STREAM_NAME = "mux";

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/", (req, res) => {
  res.send("Hello world, I am simply a server. If you ask politely, I may give you a stream key");
  writeStreamKeyToDB("test", "extremely good " + Math.random());
});

const createNewStream = async (streamName: string) => {
  const { stream_key, id } = await Video.LiveStreams.create({
    low_latency: true,
    playback_policy: "public",
    new_asset_settings: { playback_policy: "public" },
     
  });
  return { stream_key, stream_id: id};
};

app.get("/stream-names", async (req, res) => {
  console.log("Received request for Stream Names, returning them", STREAM_NAMES);
  res.send(STREAM_NAMES);
});

//TODO: HONESTLY THIS WHOLE FLOW IS A SERIOUS PROBLEM CUZ IM NOT MANAGING THE ID'S PROPERLY
//(like mux might be creating and destroying 1000,000 streams for all i know gotta think about this)
app.get("/stream-key/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send("No stream name provided");
  }
  if (!STREAM_NAMES.includes(id)) {
    res.status(400).send("Stream name not valid");
  }
  const cachedKey = await getStreamKey(id);
  if (!cachedKey) {
    const {stream_key, stream_id} = await createNewStream(id);
    if (stream_key && stream_id) {
      await writeStreamKeyToDB(id, stream_key);
      await writeStreamIDToDB(id, stream_id);
      res.send({key: stream_key});
    } else {
      res.status(500).send("Error creating stream key");
    }
  } else {
    res.send({key: cachedKey});
  }
});

//Listening for hooks
const authChecker: RequestHandler = (req, res, next) => {
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

const getPlaybackID = ( data: any) => {
  const playbackIDs =  data["playback_ids"];
  if (playbackIDs && playbackIDs[0]) {
    return playbackIDs[0].id
  }
  return undefined
}
app.post("/mux-hook", authChecker, async (req, res) => {
  //Gimme a sec fam. Ill figure this out in a moment.
  console.log(chalk.blue("Webhook message received"));
  if (req.body && req.body.type) {
    console.log(chalk.blue(req.body.type));
    switch (req.body.type) {
      case "video.live_stream.idle": 
        console.log(chalk.yellowBright("Stream went idle"));
        let streamName = await getStreamNameForID(req.body.data.id);
        writeStreamStateToDB(streamName, "idle");
        return res.status(200).send("Thanks for the update :) ")
      case "video.live_stream.active":
        let playbackID = getPlaybackID(req.body.data);
        console.log(chalk.greenBright("Stream went active, with playbackID " + playbackID));
        //console.log(util.inspect(req.body, {colors: true, depth: 2}))
        //console.log(util.inspect(req.body.data.playback_ids, {colors: true, depth: 2}))
        let streamName2 = await getStreamNameForID(req.body.data.id);
        writeStreamStateToDB(streamName2, "active")
        if (playbackID) writePlaybackIDToDB(streamName2, playbackID);
        return res.status(200).send("Thanks for the update :) ")
    }
  }
  //writeStreamStateToDB(TEST_STREAM_NAME, "unknown");
  return res.status(200).send("hmmm, something broke")
});

httpServer.listen(port, () => {
  console.log(chalk.blue(`Server is LIVE on port ${port}`));
});
