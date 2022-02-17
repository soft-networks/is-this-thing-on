import "../styles/globals.css";
import type { AppProps } from "next/app";
import { CollectiveProvider } from "../useHooks/useCollective";
import { StreamNamesProvider } from "../useHooks/useStreamNames";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StreamNamesProvider>
      <CollectiveProvider>
        <Component {...pageProps} />
      </CollectiveProvider>
    </StreamNamesProvider>
  );
}

export default MyApp;
