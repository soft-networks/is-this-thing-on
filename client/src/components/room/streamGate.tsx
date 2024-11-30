import {
  Call,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-sdk";
import { getAuth } from "firebase/auth";

import { useCallback, useEffect, useState } from "react";

import { app } from "../../lib/firestore/init";
import { logError, logInfo } from "../../lib/logger";
import { getStreamAdminCredentials } from "../../lib/server-api";
import { useAdminStore } from "../../stores/adminStore";
import { useRoomStore } from "../../stores/roomStore";

const auth = getAuth(app);
const publicUser: User = { type: "anonymous" };

/**
 * StreamGate provides context for being in a Stream call as an admin or viewer. Upon initializing, it will:
 *
 * - (As an admin) Get or create a stream call and admin RTMPS credentials
 * - (All roles) Join the call as an admin or anonymous viewer
 *
 * Upon leaving the page, the user will automatically leave the call.
 *  */
const StreamGate: React.FunctionComponent<{
  children: any;
  roomID: string;
  streamPlaybackID?: string;
  anonymousOnly: boolean;
}> = ({ children, roomID, streamPlaybackID, anonymousOnly }) => {
  const isAdmin = useAdminStore(useCallback((s) => s.isAdmin, []));

  const [state, setState] = useState<{
    client: StreamVideoClient;
    call: Call;
    rtmpsDetails: RtmpsDetails | null;
  }>();

  const useAdmin = !anonymousOnly && isAdmin;

  useEffect(() => {
    getClient(roomID, useAdmin).then(([myClient, rtmpsDetails]) => {
      if (!streamPlaybackID) {
        // Technically, streamPlaybackID may be indirectly set in the middle of getClient()
        // so there is a race condition here. If this happens, we will call getClient twice,
        // and that's okay.
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
  }, [roomID, streamPlaybackID, useAdmin]);

  useEffect(() => {
    if (!state) {
      return;
    }

    logInfo("....JOINING CALL....");

    // Ensure camera is disabled by default on page load.
    state.call.camera.disable();

    state.call
      .join()
      .then(() => {
        logInfo("Joined call from StreamGate");
      })
      .catch((e) => {
        logError("Failed to join call", e);
      });

    return () => {
      state.call.leave().catch((e) => {
        logError("Failed to leave call", e);
      });
    };
  }, [state]);

  if (!state || !state.client || !state.call) return null;

  return (
    <StreamVideo client={state.client}>
      <StreamCall call={state.call}>{children(state.rtmpsDetails)}</StreamCall>
    </StreamVideo>
  );
};

/** Retrieves the Stream video client as an admin or anonymous viewer. */
const getClient = async (
  roomId: string,
  useAdmin: boolean,
): Promise<[StreamVideoClient, null | RtmpsDetails]> => {
  if (useAdmin) {
    /**
     * After we have verified the user as a room admin, we can make calls using secrets retrieved from the server and
     * not worry too much about those credentials being viewable in the console.
     */
    console.log("using admin credentials for stream player");
    if (!auth.currentUser) {
      throw Error("Current user is unexpectedly null");
    }

    const adminToken = await auth.currentUser.getIdToken();
    const creds = await getStreamAdminCredentials(adminToken, roomId);
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

export default StreamGate;
