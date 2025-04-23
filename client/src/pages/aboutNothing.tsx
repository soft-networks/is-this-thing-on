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
    <div className="whiteFill fullBleed overflowScroll">
      <Head>
        <title>about NO-THING</title>
      </Head>
      <div className="center:absolute highestLayer medium stack:s2 padded">
        <div className="stack:s-1">
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
            <Link href="/" className="underline">← back to thing.tube</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutNothing;