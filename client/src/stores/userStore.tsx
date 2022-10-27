import create from "zustand";
import { persist } from "zustand/middleware";
import { getAuth, createUserWithEmailAndPassword, User, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";

import { app } from "../lib/firestore/init";
const auth = getAuth(app);

interface UserState {
  currentUser: User | undefined;
  displayName: string,
  signIn: (username: string, password: string, signInComplete: (complete: boolean, error?: string)=> void) => void;
  signUp: (email: string, password: string,  signUpCompete: (complete: boolean, error?: string) => void) => void;
  signOut: () => void;
  updateDisplayname: (displayName: string, callback: (success: boolean, error?: Error) => void) => void,
}


export const useUserStore = create<UserState>()(
  persist((set) => ({
    currentUser: undefined,
    displayName: `anon-${Math.floor(Math.random() * 1000)}`,
    updateDisplayname: (displayName, callback) => {
      let currentUser = auth.currentUser;
      if (!currentUser) {
        callback(false, new Error("there wasn't a user"));
        return;
      }
      console.log("lets go" , currentUser);
      updateProfile(currentUser, {
        displayName: displayName
      }).then(() => {
        // Profile updated!
        // ...
        console.log("Name updated!", displayName);
        if (auth.currentUser) {
          set({currentUser: auth.currentUser, displayName: displayName});
        }
        callback(true);    
      }).catch((error) => {
        // An error occurred
        // ...
        console.log(error);
        callback(false, error);
      });
    
    },
    signIn: (username: string, password: string, onSignIn) => {
      signInWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          set((s) => ({ currentUser: user }));
          onSignIn(true);
          console.log("Account logged in sucesfully");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error(errorMessage);
          onSignIn(false, errorMessage);
        });
      return;
    },
    signUp: (email: string, password: string, onSignUp) => {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          set((s) => ({ currentUser: user }));
          console.log("Account created succesfully");
          onSignUp(true);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error(errorMessage);
          onSignUp(false, errorMessage);
          // ..
        });
    },
    signOut: () => {
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          console.log("Signed out");
          set((s) => ({ currentUser: undefined }));
        })
        .catch((error) => {
          console.log("Error signing out" , error);
          // An error happened.
        });
    },
  }), { name: "auth-store"})
);
