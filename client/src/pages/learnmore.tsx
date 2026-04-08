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
      <div className="medium stack:s2 padded" style={{ margin: "0 auto", paddingTop: "var(--s5)", maxWidth: "72ch" }}>
        <div className="stack:s-1">
          <p>
            <b><em>ABOUT:</em></b>
          </p>
          <p>
            <Link href="/live" className="underline">
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
            Our code is open source and archived on our <a href="https://github.com/soft-networks/is-this-thing-on" className="underline">github</a>. For the full history of our project, feel free to explore our <Link href="/" className="underline">past performances</Link> or our public archive on <a href="https://drive.google.com/embeddedfolderview?id=1kQnnvjLfiySUOoV8foHPa2sKUNVrGeZm#grid" className="underline">google drive</a>.
          </p>
        </div>

        <div className="stack:s-1">
          <p>
            <b><em>JOIN US:</em></b>
          </p>
          <p>
            <Link href="/live" className="underline">
              thing.tube
            </Link>{" "}
            is open to your curatorial concepts! if you have an idea for a way to use thing.tube: <a href="https://docs.google.com/forms/d/e/1FAIpQLSeKxPh6fgDhPJ_meOqQeTBDqJiEzooKrdV7W-u4Jswsh3VjtA/viewform?usp=publish-editor" className="underline">share your idea here!</a> 
          </p>
        </div>

        <div className="stack:s-1">
          <p>
            <b><em>TY:</em></b>
          </p>
          <p>
            Thank you to supporting institutions:{" "}
            <a href="https://www.newinc.org/" className="underline" target="_blank" rel="noopener noreferrer">NEW INC</a>,{" "}
            <a href="https://movingimage.org/" className="underline" target="_blank" rel="noopener noreferrer">Museum of Moving Image</a>,{" "}
              <a href="https://nguyenwahed.com/" className="underline" target="_blank" rel="noopener noreferrer">Nguyen Wahed</a>,{" "}
            <a href="https://grayarea.org/cchange/" className="underline" target="_blank" rel="noopener noreferrer">C/Change</a> (via <a href="https://grayarea.co/" className="underline" target="_blank" rel="noopener noreferrer">Gray Area</a>!),{" "}
            <a href="https://onx.studio/" className="underline" target="_blank" rel="noopener noreferrer">Onassis ONX Studio</a>, {" "}
            <a href="https://getstream.io/" className="underline" target="_blank" rel="noopener noreferrer">Stream</a>, and you someday? (help u$!)<br></br><br></br>
            Thanks to our devs: Bhavik Singh, Mark Ramos, Sarah Rothberg, and Kevin Yeh.
          </p>
         <p><em> <a href=" https://docs.google.com/forms/d/e/1FAIpQLSfzBlUNk8-gp9j4ZApI9eFrl0iAXKMptsVFGcrE7FwDbhAsdQ/viewform?usp=publish-editor" className="underline">CONTACT US!</a></em></p>   
        </div>
        <Link href="/"><div className="border padded greenFill:hover ">
          Home
        </div></Link>
      </div>
    </div>
  );
};

export default About;