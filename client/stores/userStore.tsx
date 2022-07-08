import create from "zustand";
import { persist } from "zustand/middleware";
import { getAuth, createUserWithEmailAndPassword, User, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { app } from "../lib/firebase-init";

const auth = getAuth(app);

const wrapEmail = (username: string) => {
  return username + "@fake.com";
};

interface UserState {
  currentUser: User | undefined;
  signIn: (username: string, password: string) => void;
  signUp: (username: string, password: string) => void;
  signOut: () => void;
}

export const useUserStore = create<UserState>()(
  persist((set) => ({
    currentUser: undefined,
    signIn: (username: string, password: string) => {
      signInWithEmailAndPassword(auth, wrapEmail(username), password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          set((s) => ({ currentUser: user }));
          console.log("Account logged in sucesfully");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error(errorMessage);
        });
      return;
    },
    signUp: (username: string, password: string) => {
      createUserWithEmailAndPassword(auth, wrapEmail(username), password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          set((s) => ({ currentUser: user }));
          console.log("Account created succesfully");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error(errorMessage);
          // ..
        });
    },
    signOut: () => {
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          set((s) => ({ currentUser: undefined }));
        })
        .catch((error) => {
          // An error happened.
        });
    },
  }), { name: "auth-store"})
);
