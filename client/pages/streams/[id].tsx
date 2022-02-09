import type { NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "../../layouts/layout";
import StreamNameGate from "../../components/streamNameGate";
import StreamStatus from "../../components/streamStatusViewer";
import { MagicPiecesViewer } from "../../components/magicPieces";


const StreamPage: NextPage = () => {
  return (
    <Layout>
      <StreamNameGate >
        <StreamStatus  />
        <MagicPiecesViewer  />
      </StreamNameGate>
    </Layout>
  );
};

export default StreamPage;
