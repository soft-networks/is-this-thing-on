import type { NextPage } from "next";
import Head from "next/head";
import { useEffect} from "react";
import { useRoomStore } from "../stores/roomStore";
import Ring from "../components/ring";


 
const About: NextPage = () => {

  const changeRoom = useRoomStore((s) => s.changeRoom);

  useEffect(() => {
    changeRoom(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

 
  return (
    <div className="whiteFill fullBleed">
      <Head>
        <title>about THING</title>
      </Head>
      <iframe
        className="fullBleed"
        src="https://drive.google.com/embeddedfolderview?id=1kQnnvjLfiySUOoV8foHPa2sKUNVrGeZm#grid "
      ></iframe>
    </div>
  );
};

const oldAbout =     <div className="padded whiteFill fullBleed">

<main className="stack">
  
  <p className="grow-text wide">
    <i className="contrastFill">is this THING on?</i> is a live streaming network for artists. It begins as a
    centralized network on corporate clouds. It will then be slowly decentralized, across 3 seasons, guided by
    public discussion and performance. Will our network resolve to a web 1.0 inspired web-ring, a blockchain
    streaming platform, or something else entirely?
  </p>

  <div className="halfWidth centerh h1 stack:s-1">
    <Ring noNav={true} />
    <p className="contrastFill border padded:s-2">
      UPCOMING: THING Season 0 Salon on Sunday, Oct 23 at 7PM EST at thing.tube.
    </p>
    <p className="border padded:s-2">
      PAST: Co-design alternative futures for live streaming with us, at our workshop on Oct 22, 2022 at Gray Area
      in San Francisco.{" "}
      <a href="https://grayarea.org/course/ga-festival-is-this-thing-on/" target="_blank" rel="noreferrer">
        {" "}
        Sign up
      </a>
      .
    </p>
    <p className="border padded:s-2">
      JOIN US: If you’re an artist or developer interested in performing, giving feedback, or helping develop the
      platform,{" "}
      <a href="mailto:hello@softnet.works" target="_blank" rel="noreferrer">
        reach out.
      </a>
    </p>
  </div>
  <p className="grow-text wide">
    THING is currently in Season 0. For now it is is a website that links out to
    livestreams on YouTube, Twitch, Amazon Live, and Chaturbate. We are not a network just yet – because Big Tech
    does not allow us to bring our audiences together using iframe tags. This is the current state of platformism.
    How does it feel to be siloed? What are the constraints and systems of consent? Where do we go next? Join us
    for a salon after the stream to discuss.
  </p>
  <p className="grow-text wide">
    THING is a cooperative project by Molly Soda, Christopher Clary, soft networks, Sarah Rothberg, Semi Anonymous Friend and
    you?. It is supported by the Next Web Grant and c/change. Thanks for stopping by and see you soon!
  </p>
</main>
</div>


export default About;
