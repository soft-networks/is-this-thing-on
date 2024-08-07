import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";
import { existsSync } from 'fs';
import { resolve } from 'path';

const envLocalPath = resolve(process.cwd(), '.env.local');
const envPath = resolve(process.cwd(), '.env');
if (existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else {
  dotenv.config({ path: envPath });
}

console.log("SETUP FIREBASE WITH PROJECT ID" , process.env.FIREBASE_PROJECT_ID)

export const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  databaseURL: "https://is-this-thing-on-320a7-default-rtdb.firebaseio.com",
  storageBucket: "is-this-thing-on-320a7.appspot.com",
});
export const firestore = getFirestore(app);