import React, { useState, useCallback, useEffect, ReactText } from "react";
import { useUserStore } from "../stores/userStore";
import { generate } from "generate-password";
import Admin from "./admin";

const Auth: React.FC = () => {
  const currentUser = useUserStore(useCallback((state) => state.currentUser, []));
  return (
    <div className="quarterWidth centerh padded">
      {currentUser ? (
        <div className="stack:s2">
          <em>welcome!</em>
          <SignOut />
          <AccountManager />
          <Admin uid={currentUser.uid} />
        </div>
      ) : (
        <div className="stack:s2">
          <div className="stack:s-1">
            <em>welcome to is this thing on</em>
            <p>
              to chat, or leave a reaction, you have to create an account. currently, all your personal data is being
              stored in Googles cloud servers, and is viewable and manageable by one central admin.{" "}
              <a href="mailto:hello@softnet.works">email us</a> if you need help, or want your data deleted.
            </p>
          </div>
          <SignUp />
          <SignIn />
        </div>
      )}
    </div>
  );
};
const SignUp: React.FC = () => {
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
    <form className="stack padded  border-thin">
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
          onChange={(e) => setEmailValue(e.target.value)}
        />
      </div>
      <div className="stack:s-2">
        <label className="caption">username for chat</label>
        <input
          value={usernameValue}
          placeholder="username"
          type="text"
          className="padded"
          onChange={(e) => setUsernameValue(e.target.value)}
        />
      </div>
      <div onClick={() => onSubmit()} className="clickable">
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

const SignOut = () => {
  const signOut = useUserStore(useCallback((state) => state.signOut, []));

  return (
    <div>
      <span className="clickable border-thin padded:s-1 whiteFill constrastFill:hover" onClick={() => signOut()}>
        sign out
      </span>
    </div>
  );
};
const AccountManager = () => {
  const currentUser = useUserStore(useCallback((state) => state.currentUser, []));
  const updateDisplayname = useUserStore(useCallback((state) => state.updateDisplayname, []));
  const [success, setSuccess] = useState<{ success: boolean; error?: Error }>();
  const [localDisplayname, setLocalDisplayname] = useState<string>("");

  useEffect(() => {
    setTimeout(() => setSuccess(undefined), 1500);
  }, [success]);

  const changeName = useCallback(
    (newName: string) => {
      updateDisplayname(newName, (s, e) => setSuccess({ success: s, error: e }));
    },
    [updateDisplayname]
  );

  return (
    <>
      <div className="stack padded border-thin">
        <em>account details</em>
        <p> email address: {currentUser?.email}</p>
        <p> user name: {currentUser?.displayName}</p>
      </div>
      <div className="stack padded border-thin">
        <em>change username</em>
        <div className="stack:s-2">
          <label className="caption">new username</label>
          <input
            type="text"
            className="padded:s-1"
            placeholder="new username"
            value={localDisplayname}
            onChange={(e) => setLocalDisplayname(e.target.value)}
          />
          <div>
            <span className="clickable padded:s-2 border-thin contrastFill:hover" onClick={(e) => changeName(localDisplayname)}>
              change username
            </span>
          </div>
        {success &&
          (success.success == true ? (
            <div className="green">succesfully changed display name!</div>
          ) : (
            <div className="red"> hmm.. something went wrong</div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Auth;
