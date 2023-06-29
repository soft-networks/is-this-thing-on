import Head from "next/head";
import { useCallback, useMemo } from "react";
import useRingStore from "../../stores/ringStore";
import { useRoomStore } from "../../stores/roomStore";
import ConsentGate from "./consentGate";
const loadingDiv = <div className="center:absolute highest"> loading...</div>;
const RoomNameGate: React.FunctionComponent<{ id: string }> = ({ id, children }) => {
  const ring = useRingStore(useCallback((room) => room.links, []));
  const isValidName = useMemo(() => {
    if (ring == undefined || Object.keys(ring).length == 0) {
      return loadingDiv;
    }
    const streamNames = Object.keys(ring);
    return streamNames.includes(id)
  }, [ring, id]);
  return isValidName ? <> {children} </> : <div> whoops, ur lost. </div>;
};
export const RoomStatusGate: React.FunctionComponent = ({ children }) => {
  const roomInfo = useRoomStore(useCallback((s) => s.roomInfo, []));
  return (
    <>
      {roomInfo == undefined && loadingDiv}
      {roomInfo && (
        <Head>
          <title>
            {roomInfo.roomName} is {roomInfo?.streamStatus == "active" ? "ON" : "OFF"}
          </title>
        </Head>
      )}
      {roomInfo && roomInfo.streamStatus == "active" && (
        <ConsentGate roomID={roomInfo.roomID} consentURL={roomInfo.consentURL}>
          {children}
        </ConsentGate>
      )}
      {roomInfo && roomInfo.streamStatus !== "active" && (
        <div className="center:absolute highest"> offline... for now</div>
      )}
    </>
  );
};

export default RoomNameGate;
