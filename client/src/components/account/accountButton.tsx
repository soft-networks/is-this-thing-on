import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useUserStore } from "../../stores/userStore";
import classNames from "classnames";

const AccountButton: React.FunctionComponent = () => {
  const displayName = useUserStore(
    useCallback((state) => state.displayName, []),
  );
  const currentUser = useUserStore(
    useCallback((state) => state.currentUser, []),
  );
  const { pathname, back } = useRouter();

  return pathname !== "/account" ? (
    <Link href="/account" passHref>
      <div
        className={classNames(
          "whiteFill border contrastFill:hover padded:s-3 clickable clickable:link",
          { showOnHoverSelfTrigger: pathname !== "/" },
        )}
        suppressHydrationWarning
      >
        {currentUser
          ? currentUser.displayName || currentUser.email
          : `${displayName}`}
      </div>
    </Link>
  ) : (
    <div className="horizontal-stack">
      <div
        className="whiteFill border contrastFill:hover padded:s-3 clickable clickable:link"
        onClick={() => back()}
      >
        close
      </div>
    </div>
  );
};

export default AccountButton;
