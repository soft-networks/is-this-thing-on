import { NextPage } from "next";

import { useRouter } from "next/router";

import Room from "../../components/room/room";

const RoomPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  if (!id || typeof id !== "string") {
    return <div className="fullBleed darkFill"> something went wrong </div>;
  }
  return <Room roomID={id as string} season={1} />;
};

export default RoomPage;
