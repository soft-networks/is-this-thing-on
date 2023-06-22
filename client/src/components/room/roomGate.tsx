import Head from "next/head";
import { useCallback, useMemo } from "react";
import useRingStore from "../../stores/ringStore";
import { useRoomStore } from "../../stores/roomStore";
import ConsentGate from "./consentGate";

const loadingDiv = <div className="center:absolute highest"> loading...</div>;

const RoomGate: React.FunctionComponent<{ id: string }> = ({ id, children }) => {
  const ring = useRingStore(useCallback((room) => room.links, []));
  const gate = useMemo(() => {
    if (ring == undefined || Object.keys(ring).length == 0) {
      return loadingDiv;
    }
    const streamNames = Object.keys(ring);
    return streamNames.includes(id) ? <> {children} </> : <div> Sorry, thats not a valid stream name </div>;
  }, [ring, id, children]);
  return gate;
};

export const RoomOnlineGate: React.FunctionComponent = ({ children }) => {
  const roomInfo = useRoomStore(useCallback((s) => s.roomInfo, []));
  const roomOnline = useMemo(() => {
    if (!roomInfo) {
      return loadingDiv;
    }
    return (
      <>
        <Head>
          <title>
          {roomInfo.roomName} is {roomInfo?.streamStatus == "active" ? "ON" : "OFF"}
          </title>
        </Head>
        {roomInfo.streamStatus == "active" ? (
          <ConsentGate roomID={roomInfo.roomID} active={roomInfo.consentURL !== undefined}>{ children }</ConsentGate>
        ) : (
          <div className="center:absolute highest"> offline... for now</div>
        )}
      </>
    );
  }, [children, roomInfo]);
  return roomOnline;
};

export default RoomGate;
