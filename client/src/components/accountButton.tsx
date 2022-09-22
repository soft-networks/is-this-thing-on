import Link from "next/link";
import { useRouter } from "next/router";
import { useUserStore } from "../stores/userStore";

const AccountButton: React.FunctionComponent = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  const { pathname, back } = useRouter();

  return pathname !== "/account" ? (
    <Link href="/account" passHref>
      <div className="whiteFill border contrastFill:hover padded:s-2 clickable">
        {currentUser ? (currentUser.displayName || currentUser.email) : "login"}
      </div>
    </Link>
  ) : (
    <div className="horizontal-stack">

    <div className="whiteFill border contrastFill:hover padded:s-2 clickable" onClick={() => back()}>back</div>    
    <Link href="/" passHref>
      <div className="whiteFill border contrastFill:hover padded:s-2 clickable">THING</div>
    </Link>
    </div>
  );
};

export default AccountButton;
