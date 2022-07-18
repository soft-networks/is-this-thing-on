import Link from "next/link";
import { useUserStore } from "../stores/userStore";

const UserDisplay: React.FunctionComponent = () => {
  const currentUser = useUserStore(state => state.currentUser);
  return (
      <Link href="/auth">{currentUser ? currentUser.email :  "login"}</Link>
  )
};

export default UserDisplay;