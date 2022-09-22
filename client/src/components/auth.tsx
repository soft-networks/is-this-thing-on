import { useState, useCallback, useEffect } from "react";
import { useUserStore } from "../stores/userStore";
import { generate } from "generate-password";
import Admin from "./admin"

const Auth: React.FC = () => {
  const currentUser = useUserStore(useCallback((state) => state.currentUser, []));
  return (
    <div className="quarterWidth centerh padded">
      {currentUser ? (
        <div className="stack:s2">
          <div>
            <p> <em>welcome!</em> </p>
            <p> email address: {currentUser.email}</p>
            <p> user name: {currentUser.displayName}</p>
          </div>
          <SignOut />
          <AccountManager/>
          <Admin uid={currentUser.uid} />
        </div>
      ) : (
        <div className="stack:s2">
          <SignUp />
          <SignIn />
        </div>
      )}
    </div>
  );
};
const SignUp: React.FC = () => {
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [error, setError] = useState("");
  const signUp = useUserStore(useCallback((state) => state.signUp, []));

  const signUpComplete = useCallback(
    (success: boolean, error?: string) => {
      if (success) {
        setUsernameValue("");
        setPasswordValue("");
      } else {
        setError(error || "There was an error signing up sorry");
      }
    },
    [setUsernameValue, setPasswordValue, setError]
  );

  const onSubmit = () => {
    if (usernameValue == "" || passwordValue == "") {
      console.error("Need username and password");
      return;
    }
    console.log("signing up with password", passwordValue);
    signUp(usernameValue, passwordValue, signUpComplete);
  };
  const generatePassword = () => {
    setPasswordValue(generate());
  };

  return (
    <div className="stack padded  border-thin">
      <div> <em>sign up</em> </div>
      <input
        value={usernameValue}
        placeholder="email"
        type="email"
        className="padded"
        onChange={(e) => setUsernameValue(e.target.value)}
      />
      <div>
        {passwordValue == "" ? (
          <div onClick={generatePassword} className="padded border-thin clickable whiteFill contrastFill:hover">
            {" "}
            Generate unique password{" "}
          </div>
        ) : (
          <div className="stack:s-1">
            <div className="contrastFill padded">{passwordValue}</div>
            <div className="caption">
              This is your unique password. Keep it somewhere self. If you lose it, well.. we will help you get back into your account so no worries! 
            </div>
          </div>
        )}
      </div>
      <div onClick={() => onSubmit()} className="clickable">
        {" "}
        create account{" "}
      </div>
      <div className="red">{error}</div>
    </div>
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
      <div><em> sign in </em></div>
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
    <div  >
      <span className="clickable border-thin padded:s-1 whiteFill" onClick={() => signOut()}>
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

  useEffect(() => {
    
    if (currentUser) {
        if (currentUser.displayName) {
          if (currentUser.displayName !== localDisplayname)
            setLocalDisplayname(currentUser.displayName);
        } else {
          let r = Math.round(Math.random() * 1000);
          updateDisplayname(`anon-${r}`, (s,e) => setSuccess({success: s, error: e}))
        }
      } 
    } 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  , [currentUser,  updateDisplayname]);

  const changeName = useCallback((newName: string) => {
    updateDisplayname(newName, (s,e) => setSuccess({success: s, error:e}))    
  }, [updateDisplayname])

  return (
    <div className="stack border-thin lightFill padded">
      <div><em>Change your username</em></div>
      <input
        type="text"
        className="padded:s-1"
        value={localDisplayname}
        onChange={(e) => setLocalDisplayname(e.target.value)}
      />
      {currentUser && localDisplayname !== currentUser?.displayName && (
        <div className="clickable" onClick={(e) => changeName(localDisplayname)}>
          submit change
        </div>
      )}
      {success &&
        (success.success == true ? (
          <div className="green">succesfully changed display name!</div>
        ) : (
          <div className="red"> hmm.. something went wrong</div>
        ))}
    </div>
  );
};

export default Auth;
