import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import StreamNameGate from "../../components/streamNameGate";
import StreamStatus from "../../components/streamStatusViewer";
import { getStreamKey } from "../../lib/server-api";
import useCurrentStreamName from "../../useHooks/useCurrentStreamName";
import { StreamNamesProvider } from "../../useHooks/useStreamNames";

const AdminPage: NextPage = () => {
  
  const id = useCurrentStreamName();
  const [streamKey, setStreamKey] = useState<string | undefined>();

  const acquireKey = useCallback(async () => {
      const key = await getStreamKey(id as string);
      if (key) {
        setStreamKey(key);
      }
  }, [id])
  return (
    <StreamNamesProvider>
      <StreamNameGate >
        <div className="stack">
          <h3> {id} admin page </h3>
          <div>
            {streamKey && streamKey !== "" ? streamKey : <div onClick={(e) => acquireKey()} className="button">get key</div>}
          </div>
          <hr/>
          <StreamStatus />
        </div>
      </StreamNameGate>
    </StreamNamesProvider>
  );
};

export default AdminPage;
