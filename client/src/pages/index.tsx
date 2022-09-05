import type { NextPage } from "next";
import { useCallback, useEffect } from "react";
import Head from "next/head";
import ROOM_NAMES, { ONLINE_URLS } from "../../../common/commonData";
import Logo from "../components/logo";
import useRingStore from "../stores/ringStore";
 
const Home: NextPage = () => {

  const links = useRingStore(useCallback(s => s.links, []));;
  const updateStatus = useRingStore(useCallback(s => s.updateStatus, []));

  useEffect(()=> {

    //Season 0 is live right now! 
    Object.keys(links).map( name => updateStatus(name, "active"));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="padded">
      <Head>
        <title>is this thing on</title>
      </Head>
      <main className="stack">
        <p className="grow-text wide">
          <i className="contrastFill">is this THING on?</i> is a live streaming network for artists. It begins as a
          centralized network on corporate clouds. It will then be slowly decentralized, across 3 seasons, guided by
          public discussion and performance. Will our network resolve to a web 1.0 inspired web-ring, a blockchain
          streaming platform, or something else entirely?
        </p>
        <div className="halfWidth centerh h1 stack:s-1">
          {links ? <Logo linkList={Object.values(links)}/> : "huh" }
          <p className="contrastFill border padded:s-2">
            LIVE: Season 0 is now live. Watch streams now for{" "}
            {ROOM_NAMES.map((name, index) => (
              <span key={`stream-${name}`}>
              {index == ROOM_NAMES.length - 1 ? " and " : " "}
              <a href={ONLINE_URLS[index]} target="_blank" rel="noreferrer" >               
                {name}
              </a>
              {index == ROOM_NAMES.length - 1 ? "." : ","}
              </span>
            ))}
          </p>
          <p className=" border padded:s-2">
            UPCOMING: Co-design alternative futures for live streaming with us, at our workshop on Oct 22, 2022 at Gray
            Area in San Francisco.{" "}
            <a href="https://grayarea.org/course/ga-festival-is-this-thing-on/" target="_blank" rel="noreferrer">
              {" "}
              Sign up
            </a>
            .
          </p>
          <p className=" border padded:s-2">
            JOIN US: If you’re an artist or developer interested in performing, giving feedback, or helping develop the
            platform,{" "}
            <a href="mailto:hello@softnet.works" target="_blank" rel="noreferrer">
              reach out.
            </a>
          </p>
        </div>
        <p className="grow-text wide">
          THING is a cooperative project by Molly Soda, Christopher Clary, soft networks, Semi Anonymous Friend and
          you?. It is supported by the Next Web Grant and c/change. If you&apos;d like to learn even more, read an
          overview{" "}
          <a
            href="https://docs.google.com/document/d/1LYbNjOPkyk5NPZ__YnLu-rk9UJHF-KYRwWzL61K66x0/edit"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
          . Thanks for stopping by and see you soon!
        </p>
      </main>
    </div>
  );
};

export default Home;
