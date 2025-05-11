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
            On December 29, 2024, <em>NO-THING</em> unfolded as a 24-hour livestream exploring the theme of nothingness—set during what they called the &quot;nothing period of the year,&quot; between Christmas and the New Year.
          </p>
          <p>
            The event placed contemporary livestreaming practices in dialogue with a broader history of the medium, referencing and resurrecting early examples that emphasized duration and ambient presence, such as <em>The Trojan Room Coffee Machine</em>, the first livestream; <em>Watching Grass Grow</em>, the quiet feed of a suburban front lawn; and <em>Exonemo&apos;s The Internet Bedroom</em>, a 90+ person virtual sleepover.
          </p>
          <p>
            <em>NO-THING</em> featured more than 50 participants, including both emerging artists and figures from the early days of livestreaming, whose streams focused primarily on absence as activity.
          </p>
          <p>
            The piece was installed at Nguyen Wahed on the Lower East Side, where monitors were placed on milk crates in the windows of the gallery, otherwise shuttered for the holiday season.
          </p>
          <p>
            <b>NO-THING streamers included:</b> Alan Worm (Age of Empires 2 Bear Cam), anya mind (anya tv), baphomette (😈), Brian Clifton (brian), Char Stiles (taking turns being the no thing), Claire Hentschker (NOTHINGBUTADS), Claire Jervert (Bina48), Daniel Shiffman (shiffman), Em Sieler (emsieler), emily d&apos;achiardi (sneaky-felix), exonemo (Internet Bedroom), Heheheheheheheheheheheheheheherdimas., helen lin (helen), Jessie Edelstein (jessie01000101), Karla Zurita (karla/backyard), Kennie Zhou (ken y0u sea m33), Kiana Fernandez (kiana), Kiki Green (scorpiojawn), Lau Mota (L444U), Matthew Flores (maaaaaaaaaatt), Mark Ramos (waitforit), Morry Kolman (WTTDOTM), Mister Grass (Watching Grass Grow), OK Books (loveheart), peter burr (void), Quentin Stafford-Fraser (Trojan Room Coffee Pot), Rosalie Yu (KiddieRide), Sloane Frederick (🦋🪰🦋), Spencer Chang (🟧🟦🟩🟪 🔛💻), Taylor Torres (bonita buzzkill / bonita ·͙⁺˚*•̩̩͙✩), and many more who wish to remain anonymous.
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
            <a href="https://wttdotm.com/" className="underline">Morry</a> Kolman’s stream [WTTDOTM] displayed feeds of NYC traffic cameras alongside a computer colorfully displaying his SSN and facing the wrong way.
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
            <a href="https://shortiecountry.squarespace.com" className="underline">Sloane Frederick</a> sloane’s stream read poems by don marquis
          </p>
          <p>
            <a href="https://clairejervert.com" className="underline">Claire Jervert</a> Claire Jevert presented a 24-hour live feed of the VR avatar of humanoid robot Bina48; the avatar was alert, fully connected to the actual robot&apos;s AI, and continuously stared at the viewer, blinking occasionally.
          </p>
          <p>
            <a href="https://www.watching-grass-grow.com" className="underline">Mister Grass</a> LIVE WEBCAM of Watching Grass Grow since 2005!
          </p>
          <p>
            <a href="https://instagram.com/scorpiojawn" className="underline">Kiki Green / scorpiojawn</a> Kiki’s stream [Scorpiojawn] showed an unproductive day in her art studio.
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
