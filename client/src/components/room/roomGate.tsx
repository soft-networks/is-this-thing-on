import Head from "next/head";
import { useCallback, useMemo } from "react";

import useRingStore from "../../stores/ringStore";
import { roomIsActive, useRoomStore } from "../../stores/roomStore";
import ConsentGate from "./consentGate";

const loadingDiv = <div className="center:absolute"> loading...</div>;
const RoomNameGate: React.FunctionComponent<{ id: string }> = ({
  id,
  children,
}) => {
  const ring = useRingStore(useCallback((room) => room.links, []));
  const isValidName = useMemo(() => {
    if (ring == undefined || Object.keys(ring).length == 0) {
      return loadingDiv;
    }
    const streamNames = Object.keys(ring);
    return streamNames.includes(id);
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
            {roomInfo.roomName} is {roomIsActive(roomInfo) ? "ON" : "OFF"}
          </title>
        </Head>
      )}
      {roomInfo && roomIsActive(roomInfo) && (
        <ConsentGate roomID={roomInfo.roomID} consentURL={roomInfo.consentURL}>
          {children}
        </ConsentGate>
      )}
      {roomInfo && roomIsActive(roomInfo) && (
        <div className="center:absolute"> offline... for now</div>
      )}
    </>
  );
};

export default RoomNameGate;
