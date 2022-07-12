import { NextPage } from "next";
import Layout from "../layouts/layout";
import { useCallback,  useState } from "react";
import { useUserStore } from "../stores/userStore";
import { generate } from "generate-password";

const Auth: NextPage = () => {
  const currentUser  = useUserStore(useCallback(state => state.currentUser,[]));

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
  const signOut  = useUserStore(useCallback(state => state.signOut,[]));

  return (
    <button onClick={() => signOut()} className="clickable">
      sign out
    </button>
  );
};

const SignUp: React.FC = () => {
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [error, setError] = useState("");
  const signUp  = useUserStore(useCallback(state => state.signUp,[]));

  const signUpComplete = useCallback((success: boolean, error?: string) => {
    if (success) {
      setUsernameValue("");
      setPasswordValue("");
    } else {
      setError(error || "There was an error signing up sorry");
    }
  }, [setUsernameValue, setPasswordValue, setError]);

  const onSubmit = () => {
    if (usernameValue == "" || passwordValue == "") {
      console.error("Need username and password");
      return;
    }
    console.log("signing up with password" , passwordValue)
    signUp(usernameValue, passwordValue, signUpComplete);
  };
  const generatePassword = () => {
    setPasswordValue(generate());
  }

  return (
    <div className="stack narrow">
      <div> sign up </div>
      <input value={usernameValue} placeholder="email" type="email" onChange={(e) => setUsernameValue(e.target.value)} />
      <div>
        {passwordValue == "" ? (
          <button onClick={generatePassword}> Generate unique password </button>
        ) : (
          <div>
            your unique password is below. copy this somewhere safe. if you lose it your account will be lost : <br/>
            {passwordValue}
          </div>
        )}
      </div>
      <button onClick={() => onSubmit()}> create account </button>
      <div className="red">
        {error}
      </div>
    </div>
  );
};

const SignIn: React.FC = () => {
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [error, setError] = useState("");
  const signIn  = useUserStore(useCallback(state => state.signIn, []));

  const signInComplete = useCallback((success: boolean, error?: string) => {
    if (success) {
      setUsernameValue("");
      setPasswordValue("");
    } else {
      setError(error || "There was an unknown error signing in sorry");
    }
  }, [setUsernameValue, setPasswordValue, setError]);

  const onSubmit = () => {
    if (usernameValue == "" || passwordValue == "") {
      console.error("Need username and password");
      return;
    }
    signIn(usernameValue, passwordValue, signInComplete);
  };

  return (
    <div className="stack narrow">
      <div> sign in </div>
      <input value={usernameValue} placeholder="email" type="email" onChange={(e) => setUsernameValue(e.target.value)} />
      <input
        value={passwordValue}
        placeholder="password"
        type="password"
        onChange={(e) => setPasswordValue(e.target.value)}
      />
      <button onClick={() => onSubmit()}> sign in </button>
      <div className="red">
        {error}
      </div>
    </div>
  );
};

export default Auth;
