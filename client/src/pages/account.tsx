import { NextPage } from "next";
import Auth from "../components/auth";
import Layout from "../layouts/layout";



const Account: NextPage = () => {

  return (
    <Layout>
      <Auth/>
    </Layout>
  );
};

export default Account;


