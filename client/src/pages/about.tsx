import type { NextPage } from "next";


import Head from "next/head";
import { useEffect } from "react";
import { useRoomStore } from "../stores/currentRoomStore";
import Link from 'next/link';




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
         <Link href="/"className="underline">
           thing.tube
         </Link> is an experimental livestreaming platform for artists, founded by the collective &quot;is this thing on?&quot;
         (<a href="https://christopherclary.com/"className="underline">Christopher Clary</a>, <a href="https://sarahrothberg.com/"className="underline">Sarah Rothberg</a>, <a href="https://mollysoda.exposed/"className="underline">Molly Soda</a>, and <a href="https://softnet.works/"className="underline">Bhavik Singh</a>).
       </p>

       <p>
         thing.tube is both a performance platform and a form of <i>software development as performance art</i>: we develop it to fit our own creative desires and with conceptual questions in mind about online platforms and the current context of livestreaming and the web. It is always changing.
         Right now on thing.tube streamers make their own customizable rooms, which are connected by a webring and a universal chat. We typically do group stream performances and announce them here and on our <a href="https://www.instagram.com/thing.tube/" className="underline">IG</a>. 
       </p>

       <p>
         First launched in 2022, the website has featured performances by <a href="https://chia.design/" className="underline" >Chia Amisola</a>, <a href="https://ritual.engineer/"className="underline">Herdimas Anggara</a>, <a href="https://linktr.ee/darladevoursyou"className="underline">Darla Devour</a>, <a href="https://mayaontheinter.net/" className="underline">Maya Man</a>, 
         and the founding members.
         THING is made possible with support from the Gray Area C/Change grant, NEW INC Next Web grant, Onassis ONX, Museum of the Moving Image (MoMI),
         and developers <a href="https://www.markhramos.net" className="underline" >Mark Ramos</a>, and <a href="https://kyeh.me/" className="underline">Kevin Yeh</a>.
       </p>

       <p>
         Our code is open source and archived on our <a href = "https://github.com/soft-networks/is-this-thing-on" className="underline" >github</a>.
         For the full history of our project, feel free to explore our public archive on <a href = "https://drive.google.com/embeddedfolderview?id=1kQnnvjLfiySUOoV8foHPa2sKUNVrGeZm#grid" className="underline" >google drive.</a>
       </p>
       </div>
       <div className="stack:s-1">
       <p>
         <b><em>UP NEXT:</em></b>
       </p>

       <p>
         Due to FORCE MAJEURE our IRL show at <a href = "https://movingimage.org/" className="underline" >MoMI</a> is postponed until Spring 2025! In the meantime, we will do NO-THING, a 24-hour stream on the theme of NOTHING, December 29. <Link href="https://docs.google.com/forms/d/e/1FAIpQLSdfDAp4BTtW1RZKcfJX3xArCa3cVEJTpMQgd7fz0M5c5_yLlg/viewform?usp=sf_link" className="underline">Let us know if you&apos;d like to participate?
         </Link>      
       </p>
       </div>
     </div>
   </div>
 );
};


export default About;