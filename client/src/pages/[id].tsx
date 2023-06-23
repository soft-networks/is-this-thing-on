import { NextPage } from "next";
import { useRouter } from "next/router";
import Room from "../components/room/room";
import RoomGate from "../components/room/roomGate";
import Layout from "../components/room/layout";

const RoomPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  if (!id || typeof id !== "string") {
    return <div className="fullBleed darkFill"> something went wrong </div>;
  }
  console.log(id);

  return <Room roomID={id as string} season={1} />;
};

export default RoomPage;
