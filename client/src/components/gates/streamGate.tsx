import {
  Call,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-sdk";

import { useCallback, useEffect, useState } from "react";

import { logCallbackDestroyed, logCallbackSetup, logError, logInfo } from "../../lib/logger";
import { getStreamAdminCredentials } from "../../lib/server-api";
import { useGlobalAdminStore } from "../../stores/globalUserAdminStore";
import { useRoomStore } from "../../stores/currentRoomStore";

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
  const isAdmin = useGlobalAdminStore(useCallback((s) => s.isAdmin, []));

  const [state, setState] = useState<{
    client: StreamVideoClient;
    call: Call;
    rtmpsDetails: RtmpsDetails | null;
  }>();

  const useAdmin = !anonymousOnly && isAdmin;

  //On page load, create a client which should set a streamPlaybackID in the server. If not, we will end up re-calling getClient() once it loads.
  useEffect(() => {
    logCallbackSetup(`Creating stream call for ${roomID}`);
    let myClient: StreamVideoClient;
    let isActive = true; // Add flag to prevent setting state after unmount

    getClient(roomID, useAdmin).then(([client, rtmpsDetails]) => {
      if (!isActive) {
        // If component unmounted, cleanup the client
        client.disconnectUser().catch(e => 
          logError("Failed to disconnect client after unmount", e)
        );
        return;
      }
      myClient = client;
      if (!streamPlaybackID) {
        return;
      }
      const myCall = myClient.call("livestream", streamPlaybackID);
      myCall
        .get()
        .then(() => {
          if (isActive) { // Only set state if component is still mounted
            logInfo("Setting state for call ID " + streamPlaybackID);
            setState({ client, call: myCall, rtmpsDetails });
          }
        })
        .catch((e) => logError("Failed to retrieve call details", e));
    });

    return () => {
      isActive = false; // Mark component as unmounted
      // Cleanup if component unmounts during initialization
      if (myClient) {
        myClient.disconnectUser().catch(e => 
          logError("Failed to disconnect client during init cleanup", e)
        );
      }
    };
  }, [roomID, streamPlaybackID, useAdmin]);

  useEffect(() => {
    if (!state) {
      return;
    }
    let isActive = true; // Add flag for this effect too

    // Ensure camera is disabled by default on page load.
    state.call.camera.disable();

    state.call
      .join()
      .then(() => {
        if (isActive) {
          logInfo(`Joined call from StreamGate ${state.call.cid}`);
        }
      })
      .catch((e) => {
        logError("Failed to join call", e);
      });

    return () => {
      isActive = false;
      // First leave the call
      state.call.leave()
        .then(() => {
          // Then disconnect the client
          state.client.disconnectUser();
          logCallbackDestroyed('Successfully cleaned up call and client connections');
        })
        .catch((e) => {
          logError("Failed to leave call or disconnect client", e);
        });
    };
  }, [state]);

  if (!state || !state.client || !state.call) {
    logInfo("StreamGate is failing, returning out: ", [state]);
    return null;
  }

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
    logInfo("Using admin credentials for stream player");
    const creds = await getStreamAdminCredentials(roomId);
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
    logInfo("using public credentials for stream player");

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
