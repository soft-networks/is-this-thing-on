import { useCallback } from "react";
import { useUserStore } from "../../stores/userStore";
import { useRouter } from 'next/router';
import LoginScreen from "./loginComponents";
import LoggedInSettings from "./loggedInSettings";

const Auth: React.FC = () => {
  const currentUser = useUserStore(
    useCallback((state) => state.currentUser, []),
  );
  const router = useRouter();

  return (<div className="fullBleed lightFill">
    {currentUser ? (
      <LoggedInSettings currentUser={currentUser} key="accountManager" />
    ) : (
      <LoginScreen key="login" />
    )}
    <div className="padded:s-1 align-end:fixed horizontal-stack fullWidth">
      <div className="padded:s-2 border align-end whiteFill clickable" onClick={() => router.back()}>
        close
      </div>
    </div>
  </div>)
};


export default Auth;
