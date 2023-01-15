import "../styles/globals.css";
import Layout from '../layouts/layout';
import App from "next/app";
class MyApp extends App {
  render() {
    const { Component, pageProps, router } = this.props
    if ([`/admin/salonTemp`].includes(router.pathname)) {
      return <Component {...pageProps} />;
    }
    return (
      <Layout>
        <Component {...pageProps}></Component>
      </Layout>
    )
  }
}


export default MyApp;