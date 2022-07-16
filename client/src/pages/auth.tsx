import { NextPage } from "next";
import Layout from "../layouts/layout";
import { useCallback, useState } from "react";
import { useUserStore } from "../stores/userStore";
import { SignIn, SignUp, SignOut } from "../components/authForms";
import AdminView from "../components/adminView";

const Auth: NextPage = () => {
  const currentUser = useUserStore(useCallback((state) => state.currentUser, []));

  return (
    <Layout>
      <div className="stack narrow">
        {currentUser ? (
          <>
            <div>user signed in: {currentUser?.email}</div>
            <SignOut />
            <AdminView uid={currentUser.uid}/>
          </>
        ) : (
          <>
            <SignUp />
            <SignIn />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Auth;
