import {
  Call,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-sdk";
import { logError, logInfo } from "../../lib/logger";
import { useCallback, useEffect, useState } from "react";

import { getStreamAdminCredentials } from "../../lib/server-api";
import { useAdminStore } from "../../stores/adminStore";
import { useRoomStore } from "../../stores/roomStore";

const publicUser: User = { type: "anonymous" };

const StreamGate: React.FunctionComponent<{ children: any }> = ({
  children,
}) => {
  const isAdmin = useAdminStore(useCallback((s) => s.isAdmin, []));

  const [state, setState] = useState<{
    client: StreamVideoClient;
    call: Call;
    rtmpsDetails: RtmpsDetails | null;
  }>();

  const streamPlaybackID = useRoomStore(
    useCallback((s) => s.roomInfo?.streamPlaybackID, []),
  );

  useEffect(() => {
    const getClient = async (): Promise<
      [StreamVideoClient, null | RtmpsDetails]
    > => {
      if (isAdmin) {
        console.log("using admin credentials for stream player");
        const creds = await getStreamAdminCredentials("soft");
        const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

        return [
          new StreamVideoClient({
            user: { id: creds.userId, name: "Admin" },
            apiKey: apiKey,
            token: creds.token,
          }),
          {
            rtmpAddress: creds.call.rtmpAddress,
            rtmpStreamKey: creds.call.rtmpStreamKey,
          },
        ];
      } else {
        console.log("using public credentials for stream player");

        return [
          new StreamVideoClient({
            apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
            user: publicUser,
          }),
          null,
        ];
      }
    };

    getClient().then(([myClient, rtmpsDetails]) => {
      // TODO
      if (!streamPlaybackID) {
        return;
      }

      const myCall = myClient.call("livestream", streamPlaybackID);

      myCall
        .get()
        .then(() => {
          logInfo("Setting state for call ID " + streamPlaybackID);
          setState({ client: myClient, call: myCall, rtmpsDetails });
        })
        .catch((e) => logError("Failed to retrieve call details", e));
    });
  }, [streamPlaybackID, isAdmin]);

  useEffect(() => {
    if (!state) {
      return;
    }

    console.log({ state, message: "....JOINING CALL...." });

    // Ensure camera is disabled on initial load.
    state.call.camera.disable();

    state.call
      .join()
      .then(() => {
        console.log({ state, msg: "JOINED CALL FROM STREAM GATE" });
      })
      .catch((e) => {
        logError("Failed to join call", e);
      });

    return () => {
      state.call.leave().catch((e) => {
        logError("Failed to leave call", e);
      });
      // setState(undefined);
      // setJoined(false);
    };
  }, [state]);

  if (!state || !state.client || !state.call) return null;

  return (
    <StreamVideo client={state.client}>
      <StreamCall call={state.call}>{children(state.rtmpsDetails)}</StreamCall>
    </StreamVideo>
  );
};

export default StreamGate;
