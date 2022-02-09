import type { NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "../../layouts/layout";
import StreamNameGate from "../../components/streamNameGate";
import StreamStatus from "../../components/streamStatusViewer";


const StreamPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Layout>
      <StreamNameGate id={id as string}>
        <StreamStatus id={id as string} />
      </StreamNameGate>
    </Layout>
  );
};

export default StreamPage;
