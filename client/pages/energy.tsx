import { NextPage } from "next";
import { useEffect, useState } from "react";
import Layout from "../layouts/layout";
import { disableAllUserSync, syncAllUsers } from "../lib/firebase";

const EnergyList: NextPage = () => {
  const [userList, setUserList] = useState<{ [key: string]: number }>({});
  useEffect(() => {
    syncAllUsers(setUserList);
    return () => disableAllUserSync();
  }, []);
  return (
    <Layout>
      <table >
        <tbody>
        {Object.keys(userList).map((key) => (
          <tr key={key}>
            <td className="col"> {key} </td> 
            <td className="col"> {userList[key]} </td>
          </tr>
        ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default EnergyList;