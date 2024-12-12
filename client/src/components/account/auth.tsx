import { useCallback } from "react";
import { useGlobalUserStore } from "../../stores/globalUserStore";
import { useRouter } from 'next/router';
import LoginScreen from "./loginComponents";
import LoggedInSettings from "./loggedInSettings";

const Auth: React.FC = () => {
  const currentUser = useGlobalUserStore(
    useCallback((state) => state.currentUser, []),
  );
  const router = useRouter();

  return (<div className="fullBleed lightFill">
    {currentUser ? (
      <LoggedInSettings currentUser={currentUser} key="accountManager" />
    ) : (
      <LoginScreen key="login" />
    )}
  </div>)
};


export default Auth;
