import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEELIQs6LfHdFCnqUUNluk7tXKodeHIwE",
  authDomain: "is-this-thing-on-320a7.firebaseapp.com",
  databaseURL: "https://is-this-thing-on-320a7-default-rtdb.firebaseio.com",
  projectId: "is-this-thing-on-320a7",
  storageBucket: "is-this-thing-on-320a7.appspot.com",
  messagingSenderId: "895037288643",
  appId: "1:895037288643:web:1ded98acc61ff158c6b276",
};

if (process.env.NEXT_PUBLIC_API_KEY) {
  firebaseConfig.apiKey = process.env.NEXT_PUBLIC_API_KEY;
  firebaseConfig.authDomain = process.env.NEXT_PUBLIC_AUTH_DOMAIN || "";
  firebaseConfig.databaseURL = process.env.NEXT_PUBLIC_DATABASE_URL || "";
  firebaseConfig.projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";
  firebaseConfig.storageBucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET || "";
  firebaseConfig.messagingSenderId =
    process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID || "";
  firebaseConfig.appId = process.env.NEXT_PUBLIC_APP_ID || "";
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
