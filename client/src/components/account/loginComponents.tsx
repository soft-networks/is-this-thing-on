import { useCallback, useState } from "react";
import { useUserStore } from "../../stores/userStore";

export const SignUp: React.FC = () => {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [usernameValue, setUsernameValue] = useState("");

  const [error, setError] = useState("");
  const signUp = useUserStore(useCallback((state) => state.signUp, []));
  const updateDisplayname = useUserStore(useCallback((state) => state.updateDisplayname, []));

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
    [setEmailValue, setPasswordValue, setError]
  );

  const onSubmit = () => {
    if (emailValue == "" || passwordValue == "" || usernameValue == "") {
      console.error("Need username and password");
      return;
    }
    console.log("signing up with password", passwordValue);
    signUp(emailValue, passwordValue, () => updateDisplayname(usernameValue, signUpComplete));
  };

  return (
    <div className="stack padded  border-thin">
      <div>
        {" "}
        <em>sign up</em>{" "}
      </div>
      <div className="stack:s-2">
        <label className="caption">email</label>
        <input
          value={emailValue}
          placeholder="email"
          type="email"
          className="padded"
          name="email"
          onChange={(e) => setEmailValue(e.target.value)}
        />
      </div>

      <div className="stack:s-2">
        <label className="caption">password</label>
        <input
          value={passwordValue}
          placeholder="password"
          type="password"
          className="padded"
          name="password"
          onChange={(e) => setPasswordValue(e.target.value)}
        />
      </div>
      <div className="stack:s-2">
        <label className="caption">username for chat</label>
        <input
          value={usernameValue}
          placeholder="username"
          type="text"
          className="padded"
          name="username"
          onChange={(e) => setUsernameValue(e.target.value)}
        />
      </div>
      <div onClick={() => onSubmit()} className="clickable">
        create account
      </div>
      <div className="red">{error}</div>
    </div>
  );
};

export const SignIn: React.FC = () => {
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [error, setError] = useState("");
  const signIn = useUserStore(useCallback((state) => state.signIn, []));
  const signInComplete = useCallback(
    (success: boolean, error?: string) => {
      if (success) {
        setUsernameValue("");
        setPasswordValue("");
      } else {
        setError(error || "There was an unknown error signing in sorry");
      }
    },
    [setUsernameValue, setPasswordValue, setError]
  );
  const onSubmit = () => {
    if (usernameValue == "" || passwordValue == "") {
      console.error("Need username and password");
      return;
    }
    signIn(usernameValue, passwordValue, signInComplete);
  };

  return (
    <div className="stack border-thin padded ">
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
      <div onClick={() => onSubmit()} className="clickable">
        sign in
      </div>
      <div className="red">{error}</div>
    </div>
  );
};

