import create from "zustand";
import { persist } from "zustand/middleware";
import { getAuth, createUserWithEmailAndPassword, User, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { app } from "../lib/firebase-init";

const auth = getAuth(app);

interface UserState {
  currentUser: User | undefined;
  signIn: (username: string, password: string, signInComplete: (complete: boolean, error?: string)=> void) => void;
  signUp: (username: string, password: string, signUpCompete: (complete: boolean, error?: string) => void) => void;
  signOut: () => void;
}


export const useUserStore = create<UserState>()(
  persist((set) => ({
    currentUser: undefined,
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
    signUp: (username: string, password: string, onSignUp) => {
      createUserWithEmailAndPassword(auth, username, password)
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
          set((s) => ({ currentUser: undefined }));
        })
        .catch((error) => {
          // An error happened.
        });
    },
  }), { name: "auth-store"})
);
