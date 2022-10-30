import "../styles/globals.css";
import Layout from '../layouts/layout';
import App from "next/app";
class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <Layout>
        <Component {...pageProps}></Component>
      </Layout>
    )
  }
}
