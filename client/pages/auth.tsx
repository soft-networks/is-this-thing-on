import { NextPage } from "next";
import Layout from "../layouts/layout";
import { getAuth, createUserWithEmailAndPassword, User, signInWithEmailAndPassword } from "firebase/auth";
import { useCallback, useEffect, useRef, useState } from "react";
import { useUserStore } from "../stores/userStore";

const Auth: NextPage = () => {
  const { currentUser } = useUserStore();

  return (
    <Layout>
      <div className="stack:horizontal narrow">
        {currentUser ? (
          <SignOut />
        ) : (
          <>
            <SignUp />
            <SignIn />
          </>
        )}
      </div>
      <br />
      <div className="stack narrow">user signed in: {currentUser?.email}</div>
    </Layout>
  );
};

const SignOut = () => {
  const { signOut } = useUserStore();

  return (
    <button onClick={() => signOut} className="clickable">
      sign out
    </button>
  );
};

const SignUp: React.FC = () => {
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const { signUp } = useUserStore();

  const onSubmit = () => {
    if (usernameValue == "" || passwordValue == "") {
      console.error("Need username and password");
      return;
    }
    signUp(usernameValue, passwordValue);
    setUsernameValue("");
    setPasswordValue("");
  };

  return (
    <div className="stack narrow">
      <div> sign up </div>
      <input value={usernameValue} placeholder="username" onChange={(e) => setUsernameValue(e.target.value)} />
      <input
        value={passwordValue}
        placeholder="password"
        type="password"
        onChange={(e) => setPasswordValue(e.target.value)}
      />
      <button onClick={() => onSubmit()}> create account </button>
    </div>
  );
};

const SignIn: React.FC = () => {
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const { signIn } = useUserStore();

  const onSubmit = () => {
    if (usernameValue == "" || passwordValue == "") {
      console.error("Need username and password");
      return;
    }
    signIn(usernameValue, passwordValue);
    setUsernameValue("");
    setPasswordValue("");
  };

  return (
    <div className="stack narrow">
      <div> sign in </div>
      <input value={usernameValue} placeholder="username" onChange={(e) => setUsernameValue(e.target.value)} />
      <input
        value={passwordValue}
        placeholder="password"
        type="password"
        onChange={(e) => setPasswordValue(e.target.value)}
      />
      <button onClick={() => onSubmit()}> sign in </button>
    </div>
  );
};

export default Auth;
