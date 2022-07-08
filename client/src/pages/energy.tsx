import { NextPage } from "next";
import { useEffect, useState } from "react";
import Layout from "../layouts/layout";

const EnergyList: NextPage = () => {
  // const [userList, setUserList] = useState<{ [key: string]: number }>({});
  // useEffect(() => {
  //   syncAllUsers(setUserList);
  //   return () => disableAllUserSync();
  // }, []);
  return (
    <Layout>
      <table >
        <tbody>
          todo
        </tbody>
      </table>
    </Layout>
  );
};

export default EnergyList;