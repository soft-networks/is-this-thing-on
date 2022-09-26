import { NextPage } from "next";
import Room from "../room";
import Layout from "../../layouts/layout";

export const WorkshopPartZero: NextPage = () => {

  return (
    <Layout>
        <Room roomID={"WORKSHOP"} season={0}/>
    </Layout>
  );
};

export const WorkshopPartOne: NextPage = () => {

  return (
    <Layout>
        <Room roomID={"WORKSHOP"} season={1}/>
    </Layout>
  );
};



