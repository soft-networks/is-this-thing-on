import { NextPage } from "next";
import Room from "../room";
import Layout from "../../layouts/layout";



const WorkshopPartZero: NextPage = () => {
  return (
    <Layout>
        <Room roomID={"WORKSHOP"} season={0}/>
    </Layout>
  );
};

const WorkshopPartOne: NextPage = () => {

  return (
    <Layout>
        <Room roomID={"WORKSHOP"} season={1}/>
    </Layout>
  );
};

const Workshop: NextPage = () => {
  if (true) {
    return <WorkshopPartZero/>
  } else {
    return <WorkshopPartOne/>
  }
}

export default Workshop;