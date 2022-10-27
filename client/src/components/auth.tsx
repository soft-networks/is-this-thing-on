import { User } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { useUserStore } from "../stores/userStore";
import Admin from "./admin";
import { SignIn,  SignUp } from "./loginComponents";

const Auth: React.FC = () => {
  const currentUser = useUserStore(useCallback((state) => state.currentUser, []));
  return currentUser ? <AccountManager currentUser={currentUser} key="accountManager" /> : <LoginScreen key="login"/>;
};

const LoginScreen: React.FC = () => {
  return (
    <div className="stack:s2 padded quarterWidth centerh">
      <div className="stack ">
        <p>
        <em> welcome to is this THING on? </em>
        </p>
        <p>
          you can view streams, chat and leave reactions without an account. if you want a username or for your
          data to be tied to an identity, you can login below.
        </p>
        <p>
          please note that we are currently in Season 1 - in which all data is being stored in central servers run by
          Google, Amazon et all. there is also a central administrator (Bhavik!) who can view all your data, edit it,
          remove any chats, and so on. if you have any questions please{" "}
          <a href="mailto:hello@softnet.works" target="_blank" rel="noreferrer">
            reach out to him directly
          </a>
        </p>
      </div>
      <SignUp />
      <SignIn />
    </div>
  );
};

const AccountManager: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const displayName = useUserStore(useCallback((state) => state.displayName, []));
  return (
    <div className="quarterWidth centerh stack:s2 padded">
      <div className="stack padded align-start border-thin" key="details">
        <em> account details </em>
        <div> email: {currentUser.email} </div>
        <div> username: {displayName} </div>
        <SignOut />
      </div>
      <div className="stack padded border-thin" key="username">
        <em> change username </em>
        <p> you can change your user name - but this will only apply for future chats. </p>
        <ChangeUsername />
      </div>
      <Admin uid={currentUser.uid} />
    </div>
  );
};

const ChangeUsername: React.FC = () => {
  const updateDisplayname = useUserStore(useCallback((state) => state.updateDisplayname, []));
  const [localDisplayname, setLocalDisplayname] = useState<string>("");
  const [success, setSuccess] = useState<{ success: boolean; error?: Error }>();
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
    <div className="stack:s-2 align-start">
      <label className="caption">new username</label>
      <input
        type="text"
        className="padded:s-1 "
        placeholder="new username"
        value={localDisplayname}
        onChange={(e) => setLocalDisplayname(e.target.value)}
      />
      <div
        className="clickable padded:s-2 border-thin whiteFill contrastFill:hover"
        onClick={() => changeName(localDisplayname)}
      >
        change username
      </div>
      {success &&
        (success.success == true ? (
          <div className="green">succesfully changed display name!</div>
        ) : (
          <div className="red"> hmm.. something went wrong</div>
        ))}
    </div>
  );
};

const SignOut = () => {
  const signOut = useUserStore(useCallback((state) => state.signOut, []));

  return (
    <div className="clickable border-thin padded:s-2 whiteFill contrastFill:hover" onClick={() => signOut()}>
      sign out
    </div>
  );
};


export default Auth;