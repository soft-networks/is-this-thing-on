import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import StreamNameGate from "../../components/streamNameGate";
import StreamStatus from "../../components/streamStatusViewer";
import { getStreamKey } from "../../lib/server-api";
import { StreamNameProvider } from "../../lib/streamNameProvider";

const AdminPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log(id);
  const [streamKey, setStreamKey] = useState<string | undefined>();

  const acquireKey = useCallback(async () => {
      const key = await getStreamKey(id as string);
      if (key) {
        setStreamKey(key);
      }
  }, [id])
  return (
    <StreamNameProvider>
      <StreamNameGate id={id as string}>
        <div className="stack">
          <h3> {id} admin page </h3>
          <div>
            {streamKey && streamKey !== "" ? streamKey : <div onClick={(e) => acquireKey()} className="button">get key</div>}
          </div>
          <hr/>
          <StreamStatus id={id as string} />
        </div>
      </StreamNameGate>
    </StreamNameProvider>
  );
};

export default AdminPage;
