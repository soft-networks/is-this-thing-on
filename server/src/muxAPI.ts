import Mux from "@mux/mux-node";
import auth from "basic-auth";
import { RequestHandler } from "express";

const { Video } = new Mux(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRET);


export const muxCreateStream = async () => {
  const { stream_key, id } = await Video.LiveStreams.create({
    low_latency: true,
    playback_policy: "public",
    new_asset_settings: { playback_policy: "public" },
     
  });
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