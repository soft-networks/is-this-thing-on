import Link from "next/link";
import { useUserStore } from "../stores/userStore";

const Account: React.FunctionComponent = () => {
  const currentUser = useUserStore(state => state.currentUser);
  return (
      <Link href="/account">{currentUser ? currentUser.email :  "login"}</Link>
  )
};


export default Account;