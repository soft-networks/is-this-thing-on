import type { NextPage } from "next";

import Head from "next/head";
import { useEffect } from "react";
import { useRoomStore } from "../stores/currentRoomStore";
import Link from "next/link";

const About: NextPage = () => {
  const changeRoom = useRoomStore((s) => s.changeRoom);

  useEffect(() => {
    changeRoom(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="whiteFill fullBleed overflowScroll">
      <Head>
        <title>about THING</title>
      </Head>
      <div className="center:absolute highestLayer medium stack:s2 padded">
        <div className="stack:s-1">
          <p>
            <b><em>ABOUT:</em></b>
          </p>
          <p>
            <Link href="/" className="underline">
              thing.tube
            </Link>{" "}
            is a livestreaming network for artists, founded by the collective <em>is this thing on?</em> (
            <a href="https://christopherclary.com/" className="underline">Christopher Clary</a>,{" "}
            <a href="https://sarahrothberg.com/" className="underline">Sarah Rothberg</a>,{" "}
            <a href="https://mollysoda.exposed/" className="underline">Molly Soda</a>, and{" "}
            <a href="https://softnet.works/" className="underline">Bhavik Singh</a>).
          </p>
          <p>
            thing.tube is both a performance platform and a form of <i>software development as performance art</i>: we develop it to fit our own creative desires and with questions in mind about online platforms and the current context of livestreaming and the web. It is always changing. Right now on thing.tube, streamers make their own customizable rooms, which are connected by a webring and a universal chat. We typically do group stream performances and announce them here and on our <a href="https://www.instagram.com/thing.tube/" className="underline">IG</a>.
          </p>
          <p>
            Our code is open source and archived on our <a href="https://github.com/soft-networks/is-this-thing-on" className="underline">github</a>. For the full history of our project, feel free to explore our public archive on <a href="https://drive.google.com/embeddedfolderview?id=1kQnnvjLfiySUOoV8foHPa2sKUNVrGeZm#grid" className="underline">google drive</a>.
          </p>
        </div>

        <div className="stack:s-1">
          <p>
            <b><em>UP NOW:</em></b>
          </p>
          <p>
            <Link href="/" className="underline">
              thing.tube
            </Link>{" "}
            is installed IRL and online at <a href="https://movingimage.org/" className="underline">MoMI</a> in Queens, NY from April 12 - August 10, and an on-site performance by its core members June 7. <a href="https://movingimage.org/event/thingyou/" className="underline">More info here!</a>
          </p>
        </div>

        <div className="stack:s-1">
          <p>
            <b><em>TY:</em></b>
          </p>
          <p>
            We&apos;d like to thank the following performers for being part of past THINGs: Chia Amisola, Herdimas Anggara, bonita buzzkill (Taylor Torres), baphomette, peter burr, Darla DeVour, Spencer Chang, Brian Clifton, Jessie Edelstein, Sloane Frederick, Kiki Gree, Heheheheheheheheheheheheheheherdimas., Claire Hentschker, Matthew Flores, Mr. Grass, helen lin, Maya Man, Lau Mota, Mark Ramos, Alan Worm, Roaslie Yu, Kennie Zhou, Karla Zurita, and many more who wish to remain anonymous. A special thank you to our developers Bhavik Singh, Mark Ramos, and Kevin Yeh.
          </p>
          <p>
            <p>
              Thank you also to supporting institutions:{" "}
              <a href="https://www.newinc.org/" className="underline" target="_blank" rel="noopener noreferrer">NEW INC</a>,{" "}
              <a href="https://grayarea.org/cchange/" className="underline" target="_blank" rel="noopener noreferrer">C/Change (via Gray Area!)</a>,{" "}
              <a href="https://onx.studio/" className="underline" target="_blank" rel="noopener noreferrer">Onassis ONX Studio</a>, and{" "}
              <a href="https://getstream.io/" className="underline" target="_blank" rel="noopener noreferrer">Stream</a>.
            </p>
          </p>
          <Link href="/aboutnothing" className="underline">Read about more about one of our past performances: NO-THING</Link>
        </div>
      </div>
    </div>
  );
};

export default About;