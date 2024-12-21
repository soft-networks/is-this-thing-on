import { useCallback, useState } from "react";

import { useGlobalUserStore } from "../../stores/globalUserStore";


const LoginScreen: React.FC = () => {
  return (
    <div className="fullBleed padded overflowScroll">
    <div className="stack:s2 padded quarterWidth centerh">
      <div>
          welcome to is this THING on? <br/>
          sign in or sign up below to chat with a username or create a room.
      </div>
      <SignUp />
      <SignIn />
    </div>
    </div>
  );
};


const SignUp: React.FC = () => {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [usernameValue, setUsernameValue] = useState("");

  const [error, setError] = useState("");
  const signUp = useGlobalUserStore(useCallback((state) => state.signUp, []));
  const updateDisplayname = useGlobalUserStore(
    useCallback((state) => state.updateDisplayname, []),
  );

  const signUpComplete = useCallback(
    (success: boolean, error?: Error) => {
      if (success) {
        setEmailValue("");
        setPasswordValue("");
        setUsernameValue("");
      } else {
        setError(error?.message || "There was an error signing up sorry");
      }
    },
    [setEmailValue, setPasswordValue, setError],
  );

  const onSubmit = () => {
    if (emailValue == "" || passwordValue == "" || usernameValue == "") {
      console.error("Need username and password");
      return;
    }
    console.log("signing up with password", passwordValue);
    signUp(emailValue, passwordValue, () =>
      updateDisplayname(usernameValue, signUpComplete),
    );
  };

  return (
    <form 
      className="stack padded border:gray faintWhiteFill"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div>
        <em>sign up</em>
      </div>
        <input
          value={emailValue}
          placeholder="email"
          type="email"
          className="padded"
          name="email"
          onChange={(e) => setEmailValue(e.target.value)}
        />
        <input
          value={passwordValue}
          placeholder="password"
          type="password"
          className="padded"
          name="password"
          onChange={(e) => setPasswordValue(e.target.value)}
        />
        <input
          value={usernameValue}
          placeholder="username (can change later)"
          type="text"
          className="padded"
          name="username"
          onChange={(e) => setUsernameValue(e.target.value)}
        />
      <div className="padded:s-1 whiteFill border greenFill:hover clickable cursor:pointer inline-block" onClick={() => onSubmit()}>
        create account
      </div>
      <div className="red">{error}</div>
    </form>
  );
};

const SignIn: React.FC = () => {
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [error, setError] = useState("");
  const signIn = useGlobalUserStore(useCallback((state) => state.signIn, []));
  const signInComplete = useCallback(
    (success: boolean, error?: string) => {
      if (success) {
        setUsernameValue("");
        setPasswordValue("");
      } else {
        setError(error || "There was an unknown error signing in sorry");
      }
    },
    [setUsernameValue, setPasswordValue, setError],
  );
  const onSubmit = () => {
    if (usernameValue == "" || passwordValue == "") {
      console.error("Need username and password");
      return;
    }
    signIn(usernameValue, passwordValue, signInComplete);
  };

  return (
    <form 
      className="stack border:gray padded faintWhiteFill"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div>
        <em> sign in </em>
      </div>
      <input
        value={usernameValue}
        placeholder="email"
        type="email"
        onChange={(e) => setUsernameValue(e.target.value)}
        className="padded"
      />
      <input
        value={passwordValue}
        placeholder="password"
        type="password"
        className="padded"
        onChange={(e) => setPasswordValue(e.target.value)}
      />
      <div onClick={() => onSubmit()} className="padded:s-1 whiteFill border greenFill:hover clickable cursor:pointer inline-block">
        sign in
      </div>
      <div className="red">{error}</div>
    </form>
  );
};

export default LoginScreen;;