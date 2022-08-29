import { useRouter } from "next/router";
import streamNames from "../../../common/commonData";

const RoomGate: React.FunctionComponent<{ id: string }> = ({ id, children }) => {
  return streamNames.includes(id) ? <> {children} </> : <div> Sorry, thats not a valid stream name </div>;
};

export default RoomGate;
