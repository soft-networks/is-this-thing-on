import type { NextPage } from "next";

import Head from "next/head";
import { useEffect } from "react";
import { useRoomStore } from "../stores/currentRoomStore";
import Link from "next/link";

const AboutNothing: NextPage = () => {
  const changeRoom = useRoomStore((s) => s.changeRoom);

  useEffect(() => {
    changeRoom(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="whiteFill fullBleed overflowScroll padded">
      <Head>
        <title>about NO-THING</title>
      </Head>
      <div className="highestLayer medium stack:s3 padded centerh">
      <div className="stack">
          <p>
            <b><em>NO-THING:</em></b>
          </p>
          <p>
            On December 29, 2024, <em>NO-THING</em> is this THING on? presented a 24-hour livestream on the theme of NOTHING.
          </p>
          <p>
            <em>NO-THING</em> featured more than 40 participants, including friends, randos, and figures from the early days of livestreaming, whose streams focused primarily on NOTHING as activity.
          </p>
          <p>
            NO-THING also early examples of ambient streams including  <em>The Trojan Room Coffee Machine</em>, the first livestream; <em>Watching Grass Grow</em>, the quiet feed of a suburban front lawn; and <em>Exonemo&apos;s The Internet Bedroom</em>, a 90+ person virtual sleepover.
          </p>
          <p>
            The streams were physically installed at Nguyen Wahed on the Lower East Side, on monitors on milk crates in the windows of the gallery (while it was closed).
          </p>
        </div>

        <div className="stack">
          <p>
            <b><em>SELECTED STREAMS:</em></b>
          </p>
          <p>
            <a href="https://www.clairesophie.com/" className="underline">Claire Hentschker</a> stream [NOTHINGBUTADS] cycled through live cam footage of billboards.
          </p>
          <p>
            <a href="https://wttdotm.com/" className="underline">Morry</a> Kolman&apos;s stream [WTTDOTM] displayed feeds of NYC traffic cameras alongside a computer colorfully displaying his SSN and facing the wrong way.
          </p>
          <p>
            <a href="https://baphomette.hotglue.me/" className="underline">Sav / baphomette</a> Rotting in 144p
          </p>
          <p>
            <a href="https://omnikrll.biz/" className="underline">Alan Worm (Age of Empires 2 Bear Cam)</a> This stream repurposed an Age of Empires 2 map as a virtual wildlife preserve, giving each bear on the map some time on camera.
          </p>
          <p>
            <a href="https://kenniezhou.com" className="underline">Kennie Zhou</a> Square dance nonstop!
          </p>
          <p>
            <a href="https://spencer.place/" className="underline">spencer chang</a> Spencer Chang&apos;s stream [🟧🟦🟩🟪 🔛💻] shared their live screen, cursor movements, and keypresses using 84 pixels for 24 hours
          </p>
          <p>
            <a href="https://sneaky-felix.com" className="underline">emily d&apos;achiardi / sneaky-felix</a> emily d&apos;achiardi&apos;s stream [sneaky-felix] rotated a live &quot;in and out&quot; list for 2024 built from user comments.
          </p>
          <p>
            <a href="https://shortiecountry.squarespace.com" className="underline">Sloane Frederick</a> sloane&apos;s stream read poems by don marquis
          </p>
          <p>
            <a href="https://clairejervert.com" className="underline">Claire Jervert</a> Claire Jevert presented a 24-hour live feed of the VR avatar of humanoid robot Bina48; the avatar was alert, fully connected to the actual robot&apos;s AI, and continuously stared at the viewer, blinking occasionally.
          </p>
          <p>
            <a href="https://www.watching-grass-grow.com" className="underline">Mister Grass</a> LIVE WEBCAM of Watching Grass Grow since 2005!
          </p>
          <p>
            <a href="https://instagram.com/scorpiojawn" className="underline">Kiki Green / scorpiojawn</a> Kiki&apos;s stream [Scorpiojawn] showed an unproductive day in her art studio.
          </p>
          <p>
            <a href="https://kianafernandez.com" className="underline">kiana</a> Kiana Fernandez&apos;s stream [kianafer] showcased her parent&apos;s YouTube history, often Filipino lifestyle and food vlogs from the Philippines.
          </p>
          <p>
            <a href="https://matthew-flores.com" className="underline">Matthew Flores / Bartelby</a> Matthew Flores&apos;s stream [Bartelby] played youtube dj sets while he live coded Bartelby, the Scrivener in HTML
          </p>
          <p>
            <a href="https://emsieler.com" className="underline">Em Sieler</a> em sieler danced around her bedroom with her face + body blurred live
          </p>
          <p>
            <a href="https://www.clairesophie.com/" className="underline">CLaire Sophie</a> streamed [NOTHINGBUTADS] cycled through live cam footage of billboards.
          </p>
          <p>
            <a href="http://mollysoda.exposed/" className="underline">Molly Soda</a> let viewers drop images into a folder to be printed out.
            .
          </p>
          <p>
            <a href="https://softnet.works/" className="underline">Bhavik Singh</a> streamed [logstream] - a stream of logs from THING.tube&apos;s backend.
          </p>
          <p>
            <a href="https://christopherclary.com/" className="underline">Christopher Clary</a> streamed in two rooms, The Chrisy Show Season 1 and 2, live streamed BRB and coming-up signage without even coming back online.
          </p>
          <p>
            <a href="https://sarahrothberg.com/" className="underline">Sarah Rothberg</a> streamed a NO CONCEPT stream making it up as they went along and a google doc for ideas people came up with but didn&apos;t do.
          </p>
        </div>

        <div className="stack:s-1">
          <p>
            <Link href="/" className="underline">← back to thing.tube</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutNothing;
