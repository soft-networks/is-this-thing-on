import { NextPage } from "next";

import { useRouter } from "next/router";

import Room from "../../components/roomPage";

const RoomPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  if (!id || typeof id !== "string") {
    return <div className="fullBleed darkFill"> something went wrong </div>;
  }
  return <Room roomID={id as string} />;
};

export default RoomPage;
