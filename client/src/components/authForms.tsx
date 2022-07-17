import { useState, useCallback } from "react";
import { useUserStore } from "../stores/userStore";
import { generate } from "generate-password";


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
          <div onClick={generatePassword} className="button"> Generate unique password </div>
        ) : (
          <div>
            your unique password is below. copy this somewhere safe. if you lose it your account will be lost : <br/>
            {passwordValue}
          </div>
        )}
      </div>
      <div onClick={() => onSubmit()} className="button"> create account </div>
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
      <div onClick={() => onSubmit()} className="button"> sign in </div>
      <div className="red">
        {error}
      </div>
    </div>
  );
};

const SignOut = () => {
  const signOut  = useUserStore(useCallback(state => state.signOut,[]));

  return (
    <div onClick={() => signOut()} className="button">
      sign out
    </div>
  );
};


export {SignIn, SignUp, SignOut}