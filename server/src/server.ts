import { createAndReturnStreamKey, muxAuthHelper } from "./muxAPI.js";
import { createStreamAdminToken, getOrCreateStreamCall, streamUpdateWasReceived } from "./streamAPI.js";
import express, { Application } from "express";
import { presenceProcessor, resetMuxFirestoreRelationship } from "./firestore-api.js";

import bodyParser from "body-parser"
import { createServer } from "http";
import { logUpdate } from "./logger.js";
import { muxUpdateWasReceived } from "./processUpdate.js";

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
app.get("/stream-key/:id", createAndReturnStreamKey);
app.post("/mux-hook", muxAuthHelper, muxUpdateWasReceived);

app.post("/stream-hook", streamUpdateWasReceived);
app.get("/stream/:id/token", createStreamAdminToken)
app.get("stream/:id/call", getOrCreateStreamCall);
app.get("/reset-room/:id", async (req,res) => {
  logUpdate(`Resetting room ${req.params.id}`);
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


httpServer.listen(port, () => {
  logUpdate(`Server is LIVE on port ${port}`);
});

presenceProcessor();

