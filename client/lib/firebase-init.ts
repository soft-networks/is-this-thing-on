import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEELIQs6LfHdFCnqUUNluk7tXKodeHIwE",
  authDomain: "is-this-thing-on-320a7.firebaseapp.com",
  databaseURL: "https://is-this-thing-on-320a7-default-rtdb.firebaseio.com",
  projectId: "is-this-thing-on-320a7",
  storageBucket: "is-this-thing-on-320a7.appspot.com",
  messagingSenderId: "895037288643",
  appId: "1:895037288643:web:4da7f037a77603eac6b276",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
