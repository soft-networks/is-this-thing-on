import type { NextPage } from "next";

import Head from "next/head";
import { useEffect } from "react";
import { useRoomStore } from "../stores/roomStore";

const About: NextPage = () => {
  const changeRoom = useRoomStore((s) => s.changeRoom);

  useEffect(() => {
    changeRoom(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="whiteFill fullBleed">
      <Head>
        <title>about THING</title>
      </Head>
      <div className="center:absolute highestLayer">
      <a href="/">thing.tube</a> is an experimental live-streaming platform for artists, founded by the collective “is this thing on?” 
      (<a href="https://christopherclary.com/">Christopher Clary</a>, <a href="https://sarahrothberg.com/">Sarah Rothberg</a>, <a href="https://mollysoda.exposed/">Molly Soda</a>, and <a href="https://softnet.works/">Bhavik Singh</a>). 
      <br/>
      <br/>
      The platform is developed as a process of <i>software creation as performance art</i>. 
      Its features and form are driven by our own desires, conceptual questions about online platforms, and the current context of livestreaming and the web.
      Currently, thing.tube allows performers to stream from customized rooms, connected by a webring and a universal chat. 
      <br/>
      <br/>
      First launched in 2022, the website has featured performances by 
      <a href="https://chia.design/">Chia Amisola</a>, <a href="https://herdimasanggara.com/">Herdimas Anggara</a>, <a href="https://darlasmessfactory.com">Darla Devour</a>, <a href="https://mayaontheinter.net/">Maya Man</a>,  
      and the founding members. 
      THING is made possible with support from the Gray Area C/Change grant, NEW INC Next Web grant, Onassis ONX, Museum of the Moving Image (MoMI), 
      and developers <a href="https://www.markhramos.net">Mark Ramos</a>, and <a href="https://kyeh.me/">Kevin Yeh</a>. 
      <br/>
      <br/>
      Our code is opensource and archived on our <a href = "https://github.com/soft-networks/is-this-thing-on">github</a>.
      For the full history of our project, feel free to explore our public archive on <a href = "https://drive.google.com/embeddedfolderview?id=1kQnnvjLfiySUOoV8foHPa2sKUNVrGeZm#grid">google drive.</a> 
          <br/>
          <br/>
          <marquee>  next stream: 10/12/24 @ MoMI</marquee>
          </div>
    

        </div>
  );
};

export default About;
