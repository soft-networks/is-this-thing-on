import "../styles/globals.css";

import App from "next/app";

import Instrumentation from "../components/Instrumentation";

class MyApp extends App {
  render() {
    const { Component, pageProps, router } = this.props;
    return (
      <>
        <Component {...pageProps}></Component>
        <Instrumentation />
      </>
    );
  }
}

export default MyApp;
