import type { NextPage } from 'next'
import Head from 'next/head'
import Layout from "../layouts/layout"

const Home: NextPage = () => {
  return (
    <Layout>
      <div >
        <Head>
          <title>is this thing on</title>
        </Head>
        <main>
          this page eventually... wont exist (you only visit via a stream)
        </main>
      </div>
    </Layout>
  )
}

export default Home
