import Link from "next/link";
import { useUserStore } from "../stores/userStore";

const Account: React.FunctionComponent = () => {
  const currentUser = useUserStore(state => state.currentUser);
  return (
      <Link href="/account" passHref>
      <div className="whiteFill border contrastFill:hover padded:s-2 clickable">
        {currentUser ? currentUser.email :  "login"}
      </div>
      </Link>
  )
};


export default Account;