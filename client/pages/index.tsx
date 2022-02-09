import type { NextPage } from 'next'
import Head from 'next/head'
import Layout from "../layouts/layout"

const Home: NextPage = () => {
  return (
    <Layout>
      <div >
        <Head>
          <title>Empty page</title>
        </Head>
        <main>
          Hello there is nothing here!
        </main>
      </div>
    </Layout>
  )
}

export default Home
