import { AppProps } from "next/app";
import Layout from "../components/layout"; // Adjust the path as necessary
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;