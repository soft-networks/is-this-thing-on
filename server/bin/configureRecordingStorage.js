// This script configures our own external storage for Stream recordings in Google Cloud.
//
// PRE-REQUISITES:
// - A separate bucket needs to be made manually before running this script, and set to default public access for all objects.
// - A service account needs to be created with Cloud Storage Object Creator permissions.
// - A key JSON file needs to be created and downloaded. The JSON filename should be replaced below.
//
// WHY:
// By default, Stream offers their own storage and CDN, which should theoretically store videos up to 1-2 weeks.
// In practice, the CDN link expiration only lasts a day.
//
// NOTE:
// Stream webhooks for call.recording_ready will have an invalid stream-io-cdn URL and must be manually
// remapped to the public Cloud Storage URL. See streamAPI.ts.
//
import {
    StreamClient,
} from "@stream-io/node-sdk";
import { dirname } from 'node:path';
import dotenv from "dotenv";
import { fileURLToPath } from 'node:url';
import fs from "fs";
import path from "path";

dotenv.config();
    
const __dirname = dirname(fileURLToPath(import.meta.url));

const apiKey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRET
const client = new StreamClient(apiKey, apiSecret);

// UPDATE THIS FILENAME if you are creating external storage.
const filePath = path.join(__dirname, 'is-this-thing-on-320a7-12875719edb4.json');
const serviceAccountKeyJson = fs.readFileSync(filePath, {encoding: 'utf-8'});

console.log("Creating external storage");

await client.video.createExternalStorage({
  bucket: "is-this-thing-on-recordings",
  name: "stream-recordings-gcs",
  storage_type: "gcs",
  path: "stream_recordings/",
  gcs_credentials: serviceAccountKeyJson,
});

console.log("Verifying storage");

// Note: sometimes this fails if it's run immediately after creating the external storage.
//       running it again with the createExternalStorage line commented out will work.
await client.video.checkExternalStorage({
  name: "stream-recordings-gcs",
});

console.log("Updating call type");

await client.video.updateCallType("default", {
  external_storage: "stream-recordings-gcs"
});

await client.video.updateCallType("livestream", {
  external_storage: "stream-recordings-gcs"
});