import "../styles/globals.css";
import Layout from '../components/room/layout';
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