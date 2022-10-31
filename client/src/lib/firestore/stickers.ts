import { addDoc, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { sanitizeStickerCDNFromDB, sanitizeStickerInstanceForDB, sanitizeStickerInstanceFromDB, validateRoomName } from "./converters";
import { stickerInstanceCollection, roomDoc, stickerCDNCollection, stickerInstanceDoc } from "./locations";


export async function getStickerCDN(roomName: string, initStickerCDN: (cdn: {[key:string]: Sticker}) => void) {
  if (!validateRoomName(roomName)){
    return;
  }
  const dbStickerCDN = stickerCDNCollection(roomDoc(roomName));
  const querySnapshot = await getDocs(dbStickerCDN);
  const cdn : {[key:string]: Sticker} = {}
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
      
    const sticker = sanitizeStickerCDNFromDB(doc.data(), doc.id);
    cdn[doc.id] = sticker;
  });

  initStickerCDN(cdn);
}

export function syncStickerInstances(
  roomName: string,
  stickerAdded: (id: string, element: StickerInstance) => void,
  stickerRemoved: (id: string) => void,
  stickerPosUpdated: (id: string, pos: Pos) => void
) {
  if (!validateRoomName(roomName)) {
    return;
  }
  const dbStickers = stickerInstanceCollection(roomDoc(roomName));
  // const q = query(elements, where("behavior_type", "==", behaviorType));

  const unsub = onSnapshot(dbStickers, (docs) => {
    docs.docChanges().forEach((change) => {
      let element = change.doc;
      if (change.type === "added") {
        const sanitizedStickerInstance =  sanitizeStickerInstanceFromDB(change.doc.data());
        stickerAdded(element.id, sanitizedStickerInstance);
      }
      if (change.type === "modified") {
        let stickerData = element.data();
        if (stickerData.position) {
          stickerPosUpdated(element.id, stickerData.position);
        }
      }
      if (change.type === "removed") {
        stickerRemoved(element.id);
      }
    });
  });
  return unsub;
}

export async function addStickerInstance(roomName: string, element: StickerInstance) {
  const stickerInstances = stickerInstanceCollection(roomDoc(roomName));
  await addDoc(stickerInstances, sanitizeStickerInstanceForDB(element));
}

export async function updateStickerInstancePos(roomName: string, stickerID: string, pos: Pos) {
  const stickerInstances = stickerInstanceCollection(roomDoc(roomName));
  const stickerInstance = stickerInstanceDoc(stickerInstances, stickerID);

  setDoc(stickerInstance, {position: pos}, {merge: true});
}

export async function deleteStickerInstance(roomName: string, stickerID: string) {
  const stickerInstances = stickerInstanceCollection(roomDoc(roomName));
  const stickerInstance = stickerInstanceDoc(stickerInstances, stickerID);

  deleteDoc(stickerInstance);

}

///PLEASE DONT JUDGE ME FOR THIS  :) 

const MollyAssetsJson = [
  {
    id: "Alfredo_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Alfredo_D.png",
    type: "DELETE",
    noGift: true,
    size: { width: 768, height: 391 },
  },
  {
    id: "AmazonBox_1_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/AmazonBox_1_D.png",
    type: "DELETE",
    noGift: true,
    size: { width: 1458, height: 691 },
  },
  {
    id: "AmazonBox_2_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/AmazonBox_2_D.png",
    type: "DELETE",
    noGift: true,
    size: { width: 3873, height: 2582 },
  },
  {
    id: "AmazonBox_3_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/AmazonBox_3_D.png",
    type: "DELETE",
    noGift: true,
    size: { width: 246, height: 214 },
  },
  {
    id: "AmazonBox_5_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/AmazonBox_5_D.png",
    type: "DELETE",
    noGift: true,
    size: { width: 800, height: 416 },
  },
  {
    id: "CandySpill_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/CandySpill_D.png",
    type: "DELETE",
    noGift: true,
    size: { width: 325, height: 204 },
  },
  {
    id: "Cereal_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Cereal_D.png",
    type: "DELETE",
    noGift: true,
    size: { width: 500, height: 375 },
  },
  {
    id: "Chips_1_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Chips_1_D.png",
    type: "DELETE",
    noGift: true,
    size: { width: 720, height: 400 },
  },
  {
    id: "Chips_2_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Chips_2_D.png",
    type: "DELETE",
    noGift: true,
    size: { width: 1200, height: 797 },
  },
  {
    id: "Chips_3_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Chips_3_D.gif",
    type: "DELETE",
    noGift: true,
    size: { width: 294, height: 247 },
  },
  {
    id: "Chips_4_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Chips_4_D.gif",
    type: "DELETE",
    noGift: true,
    size: { width: 155, height: 152 },
  },
  {
    id: "Chips_5_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Chips_5_D.gif",
    type: "DELETE",
    noGift: true,
    size: { width: 500, height: 524 },
  },
  {
    id: "Clothes_1_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Clothes_1_D.png",
    type: "DELETE",
    noGift: true,
    size: { width: 1500, height: 986 },
  },
  {
    id: "Clothes_2_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Clothes_2_D.png",
    type: "DELETE",
    noGift: true,
    size: { width: 1366, height: 1292 },
  },
  {
    id: "Fly",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Fly.gif",
    type: "DELETE",
    noGift: true,
    size: { width: 216, height: 216 },
  },
  {
    id: "MysteryBowl_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/MysteryBowl_D.png",
    type: "DELETE",
    noGift: true,
    size: { width: 500, height: 500 },
  },
  {
    id: "Napkin_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Napkin_D.png",
    type: "DELETE",
    noGift: true,
    size: { width: 640, height: 640 },
  },
  {
    id: "PBCup_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/PBCup_D.png",
    type: "DELETE",
    noGift: true,
    size: { width: 696, height: 696 },
  },
  {
    id: "PizzaBox_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/PizzaBox_D.png",
    type: "DELETE",
    noGift: true,
    size: { width: 449, height: 404 },
  },
  {
    id: "PlasticBag_1_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/PlasticBag_1_D.png",
    type: "DELETE",
    noGift: true,
    size: { width: 200, height: 284 },
  },
  {
    id: "PlasticBag_2_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/PlasticBag_2_D.png",
    type: "DELETE",
    noGift: true,
    size: { width: 600, height: 600 },
  },
  {
    id: "ShoeBox_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/ShoeBox_D.png",
    type: "DELETE",
    noGift: true,
    size: { width: 550, height: 327 },
  },
  {
    id: "Trash_1_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Trash_1_D.png",
    type: "DELETE",
    noGift: true,
    size: { width: 400, height: 286 },
  },
  {
    id: "Bed_F",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Bed_F.png",
    type: "",
    noGift: true,
    size: { width: 800, height: 800 },
  },
  {
    id: "Fan_F",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Fan_F.gif",
    type: "",
    noGift: true,
    size: { width: 474, height: 188 },
  },
  {
    id: "Nightstand_F",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Nightstand_F.png",
    type: "",
    noGift: true,
    size: { width: 836, height: 1116 },
  },
  {
    id: "Shelf_F",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Shelf_F.png",
    type: "",
    noGift: true,
    size: { width: 800, height: 800 },
  },
  {
    id: "UltrafragolaMirror_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/UltrafragolaMirror_M.png",
    type: "",
    noGift: true,
    size: { width: 444, height: 861 },
  },
  {
    id: "Candle_3_G",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Candle_3_G.png",
    type: "",
    size: { width: 460, height: 460 },
  },
  {
    id: "GreenJuice_G",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/GreenJuice_G.png",
    type: "",
    size: { width: 1024, height: 1024 },
  },
  {
    id: "IcedLatte_G",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/IcedLatte_G.png",
    type: "",
    size: { width: 316, height: 316 },
  },
  {
    id: "Journal_G",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Journal_G.png",
    type: "",
    size: { width: 1200, height: 1200 },
  },
  {
    id: "LemonWater_G",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/LemonWater_G.png",
    type: "",
    size: { width: 1280, height: 1831 },
  },
  {
    id: "Matcha_G",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Matcha_G.png",
    type: "",
    size: { width: 600, height: 600 },
  },
  {
    id: "PampasGrass_G",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/PampasGrass_G.png",
    type: "",
    size: { width: 900, height: 1300 },
  },
  {
    id: "Succulent_G",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Succulent_G.png",
    type: "",
    size: { width: 433, height: 577 },
  },
  {
    id: "Art_1_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Art_1_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 1000, height: 1000 },
  },
  {
    id: "Art_2_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Art_2_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 480, height: 600 },
  },
  {
    id: "Art_3_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Art_3_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 600, height: 600 },
  },
  {
    id: "Art_4_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Art_4_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 600, height: 600 },
  },
  {
    id: "Art_5_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Art_5_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 500, height: 600 },
  },
  {
    id: "Art_6_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Art_6_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 300, height: 302 },
  },
  {
    id: "Art_7_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Art_7_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 625, height: 756 },
  },
  {
    id: "AthleticGreens_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/AthleticGreens_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 1000, height: 1000 },
  },
  {
    id: "Books_1_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Books_1_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 350, height: 136 },
  },
  {
    id: "Camera_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Camera_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 3159, height: 2304 },
  },
  {
    id: "Candle_1_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Candle_1_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 1200, height: 1355 },
  },
  {
    id: "Candle_2_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Candle_2_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 1296, height: 1296 },
  },
  {
    id: "ClawClip_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/ClawClip_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 720, height: 720 },
  },
  {
    id: "Eucalyptus_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Eucalyptus_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 800, height: 800 },
  },
  {
    id: "Hat_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Hat_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 1159, height: 800 },
  },
  {
    id: "IceRoller_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/IceRoller_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 1600, height: 2400 },
  },
  {
    id: "Lamp_1_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Lamp_1_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 350, height: 350 },
  },
  {
    id: "Lamp_2_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Lamp_2_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 1633, height: 3943 },
  },
  {
    id: "MiniSkincareHolder_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/MiniSkincareHolder_M.gif",
    type: "MOVE",
    noGift: true,
    size: { width: 1500, height: 1500 },
  },
  {
    id: "Monstera_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Monstera_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 408, height: 600 },
  },
  {
    id: "MushroomDecor_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/MushroomDecor_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 600, height: 600 },
  },
  {
    id: "NailClippers_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/NailClippers_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 400, height: 405 },
  },
  {
    id: "OlaplexOil_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/OlaplexOil_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 1080, height: 1080 },
  },
  {
    id: "Pothos_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Pothos_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 600, height: 590 },
  },
  {
    id: "Probiotics_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Probiotics_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 1300, height: 1300 },
  },
  {
    id: "RingLight_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/RingLight_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 900, height: 2438 },
  },
  {
    id: "RoseVase_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/RoseVase_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 600, height: 592 },
  },
  {
    id: "Rug_1_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Rug_1_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 850, height: 850 },
  },
  {
    id: "Shoes_1_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Shoes_1_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 967, height: 967 },
  },
  {
    id: "Slides_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Slides_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 1200, height: 436 },
  },
  {
    id: "Supergoop_1_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Supergoop_1_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 443, height: 563 },
  },
  {
    id: "Supergoop_2_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Supergoop_2_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 1500, height: 1700 },
  },
  {
    id: "TableMirror_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/TableMirror_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 700, height: 700 },
  },
  {
    id: "Throw_1_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Throw_1_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 1600, height: 1600 },
  },
  {
    id: "Throw_2_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Throw_2_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 564, height: 310 },
  },
  {
    id: "Towel_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Towel_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 450, height: 450 },
  },
  {
    id: "Tula_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Tula_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 720, height: 720 },
  },
  {
    id: "TulipVase_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/TulipVase_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 453, height: 500 },
  },
  {
    id: "UggSlippers_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/UggSlippers_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 232, height: 232 },
  },
  {
    id: "WaterBottle_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/WaterBottle_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 600, height: 600 },
  },
  {
    id: "YogaMat_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/YogaMat_M.png",
    type: "MOVE",
    noGift: true,
    size: { width: 1200, height: 1200 },
  },
];

export function bhavikShouldNeverCodeAgain() {
  const roomDocRef = roomDoc("molly");
  const dbStickerCDN = stickerCDNCollection(roomDocRef);

  for (let i =0 ; i < MollyAssetsJson.length; i++) {
    let asset = MollyAssetsJson[i];
    let id = asset.id;

    let assetDoc = doc(dbStickerCDN, id);
    setDoc(assetDoc, {url: asset.url, type: asset.type, noGift: asset.noGift || false, size: [asset.size.width, asset.size.height]})
  }
}