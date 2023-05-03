import "../styles/globals.css";
import Layout from '../layouts/layout';
import App from "next/app";
class MyApp extends App {
  render() {
    const { Component, pageProps, router } = this.props
    return (
        <Component {...pageProps}></Component>
    )
  }
}


export default MyApp;