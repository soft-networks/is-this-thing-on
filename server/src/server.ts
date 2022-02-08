import Mux from "@mux/mux-node";
import "dotenv/config";
import express, { Application, RequestHandler } from "express";
import { createServer } from "http";
import { getStreamKey, writePlaybackIDToDB, writeStreamKeyToDB, writeStreamStateToDB } from "./dbAPI.js";
import auth from "basic-auth";
import bodyParser from "body-parser"
import util from "util"
import chalk from "chalk"

const { Video } = new Mux(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRET);

const app: Application = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 4000;

const httpServer = createServer(app);
const TEST_STREAM_NAME = "mux";

app.get("/", (req, res) => {
  res.send("Hello world, I am simply a server. If you ask politely, I may give you a stream key");
  writeStreamKeyToDB("test", "extremely good " + Math.random());
});

const createNewStream = async (streamName: string) => {
  const { stream_key } = await Video.LiveStreams.create({
    low_latency: true,
    playback_policy: "public",
    new_asset_settings: { playback_policy: "public" },
     
  });
  return stream_key;
};
app.get("/stream", async (req, res) => {
  const cachedKey = await getStreamKey(TEST_STREAM_NAME);
  if (!cachedKey) {
    const streamKey = await createNewStream(TEST_STREAM_NAME);
    if (streamKey) {
      await writeStreamKeyToDB(TEST_STREAM_NAME, streamKey);
      res.send("Created new stream - key is " + streamKey);
    } else {
      res.send("Could not create a stream key");
    }
  } else {
    res.send("Returning cached key which is " + cachedKey);
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
    return res.send(401);
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
app.post("/mux-hook", authChecker, (req, res) => {
  //Gimme a sec fam. Ill figure this out in a moment.
  console.log(chalk.blue("Webhook message received"));
  if (req.body && req.body.type) {
    console.log(chalk.blue(req.body.type));
    switch (req.body.type) {
      case "video.live_stream.idle": 
        console.log(chalk.yellowBright("Stream went idle"));
        writeStreamStateToDB(TEST_STREAM_NAME, "idle");
        return res.status(200).send("Thanks for the update :) ")
      case "video.live_stream.active":
        let playbackID = getPlaybackID(req.body.data);
        console.log(chalk.greenBright("Stream went active, with playbackID " + playbackID));
        //console.log(util.inspect(req.body, {colors: true, depth: 2}))
        //console.log(util.inspect(req.body.data.playback_ids, {colors: true, depth: 2}))
        writeStreamStateToDB(TEST_STREAM_NAME, "active")
        if (playbackID) writePlaybackIDToDB(TEST_STREAM_NAME, playbackID);
        return res.status(200).send("Thanks for the update :) ")
    }
  }
  //writeStreamStateToDB(TEST_STREAM_NAME, "unknown");
  return res.status(200).send("hmmm, something broke")
});

httpServer.listen(port, () => {
  console.log(chalk.blue(`Server is LIVE on port ${port}`));
});
