import slugify from "slugify";
import create from "zustand";

interface RingState {
  links: WebRing;
  updateStatus: (roomName: string, update: RoomLinkInfo) => void;
  initializeRing: (ring: WebRing) => void;
}

// import ROOM_NAMES from "../../../common/commonData";

/** Default case, not used for now 
const ROOM_COLORS = [
  '#FFA4F0', '#BA9BC9', '#e5ff00', '#DAF4FF'
]

const ONLINE_URLS = [
  "https://www.amazon.com/live/bloatedandalone4evr1993",
  "https://chaturbate.com/the_chrisy_show",
  "https://www.youtube.com/watch?v=wvMc9QDKMuc&ab_channel=CHANNELWHATEVER",
  "https://www.twitch.tv/soft_networks",
];

const generatePlaceholderLinks = () => {
  let roomDict: { [key: string]: RoomLinkInfo } = {};
  for (let i = 0; i < ROOM_NAMES.length; i++) {
    roomDict[ROOM_NAMES[i]] = {
      roomName: ROOM_NAMES[i],
      roomColor: ROOM_COLORS[i],
      streamStatus: "disconnected",
    };
  }
  console.log()
  return roomDict;
}; */

const useRingStore = create<RingState>((set) => ({
  links: {},
  initializeRing: (ring) => { console.log("Ring initialized"); set({links: ring})},
  updateStatus: (roomName, updatedLink) => {
    set((s) => {
      let ns = { ...s.links };
      ns[roomName] = updatedLink;
      return { links: ns };
    });
  },
}));

export const roomIDToHREF = (id: string) => {
  return `/${slugify(id)}`;
}


export default useRingStore;