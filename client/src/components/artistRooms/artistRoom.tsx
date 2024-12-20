import Ambient from "./ambient";
import Chris from "./chris";
import Compromised from "./compromised";
import Darla from "./darla";
import DefaultRoom from "./defaultRoom";
import Maya from "./maya";
import Molly from "./molly";
import Sarah from "./sarah";
import Soft from "./soft";
import useMediaQuery  from '../../stores/useMediaQuery';

const ArtistRoom = ({ roomID }: { roomID: string }) => {
  const isMobile = useMediaQuery();

  if (isMobile) {
    return <DefaultRoom />;
  }

  // Existing desktop version
  // if (roomID == "compromised") {
  //   return <Compromised />;
  // }
  // if (roomID == "maya") {
  //   return <Maya />;
  // }
  // if (roomID == "ambient") {
  //   return <Ambient />;
  // }
  // if (roomID == "chrisy") {
  //   return <Chris />;
  // }
  // if (roomID == "molly") {
  //   return <Molly />;
  // }
  // if (roomID == "sarah") {
  //   return <Sarah />;
  // }
  // if (roomID == "messydarla") {
  //   return <Darla />;
  // }
  // if (roomID == "soft") {
  //   return <Soft />;
  // }
  return <DefaultRoom />;
};

export default ArtistRoom;
