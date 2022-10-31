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
  stickerPosUpdated: (id: string, pos: Pos, size: number, zIndex: number) => void
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
          stickerPosUpdated(element.id, stickerData.position, stickerData.size, stickerData.zIndex);
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
export async function updateStickerInstanceScale(roomName: string, stickerID: string, size: number) {
  const stickerInstances = stickerInstanceCollection(roomDoc(roomName));
  const stickerInstance = stickerInstanceDoc(stickerInstances, stickerID);
  setDoc(stickerInstance, {size: size}, {merge: true});
}
export async function updateStickerInstanceZIndex(roomName: string, stickerID: string, zIndex: number) {
  const stickerInstances = stickerInstanceCollection(roomDoc(roomName));
  const stickerInstance = stickerInstanceDoc(stickerInstances, stickerID);
  setDoc(stickerInstance, {zIndex: zIndex}, {merge: true});
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
  },
  {
    id: "AmazonBox_1_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/AmazonBox_1_D.png",
    type: "DELETE",
    noGift: true,
  },
  {
    id: "AmazonBox_2_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/AmazonBox_2_D.png",
    type: "DELETE",
    noGift: true,
  },
  {
    id: "AmazonBox_3_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/AmazonBox_3_D.png",
    type: "DELETE",
    noGift: true,
  },
  {
    id: "AmazonBox_5_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/AmazonBox_5_D.png",
    type: "DELETE",
    noGift: true,
  },
  {
    id: "CandySpill_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/CandySpill_D.png",
    type: "DELETE",
    noGift: true,
  },
  {
    id: "Cereal_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Cereal_D.png",
    type: "DELETE",
    noGift: true,
  },
  {
    id: "Chips_1_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Chips_1_D.png",
    type: "DELETE",
    noGift: true,
  },
  {
    id: "Chips_2_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Chips_2_D.png",
    type: "DELETE",
    noGift: true,
  },
  {
    id: "Chips_3_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Chips_3_D.gif",
    type: "DELETE",
    noGift: true,
  },
  {
    id: "Chips_4_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Chips_4_D.gif",
    type: "DELETE",
    noGift: true,
  },
  {
    id: "Chips_5_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Chips_5_D.gif",
    type: "DELETE",
    noGift: true,
  },
  {
    id: "Clothes_1_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Clothes_1_D.png",
    type: "DELETE",
    noGift: true,
  },
  {
    id: "Clothes_2_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Clothes_2_D.png",
    type: "DELETE",
    noGift: true,
  },
  {
    id: "Fly",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Fly.gif",
    type: "DELETE",
    noGift: true,
  },
  {
    id: "MysteryBowl_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/MysteryBowl_D.png",
    type: "DELETE",
    noGift: true,
  },
  {
    id: "Napkin_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Napkin_D.png",
    type: "DELETE",
    noGift: true,
  },
  {
    id: "PBCup_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/PBCup_D.png",
    type: "DELETE",
    noGift: true,
  },
  {
    id: "PizzaBox_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/PizzaBox_D.png",
    type: "DELETE",
    noGift: true,
  },
  {
    id: "PlasticBag_1_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/PlasticBag_1_D.png",
    type: "DELETE",
    noGift: true,
  },
  {
    id: "PlasticBag_2_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/PlasticBag_2_D.png",
    type: "DELETE",
    noGift: true,
  },
  {
    id: "ShoeBox_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/ShoeBox_D.png",
    type: "DELETE",
    noGift: true,
  },
  {
    id: "Trash_1_D",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Trash_1_D.png",
    type: "DELETE",
    noGift: true,
  },
  {
    id: "Bed_F",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Bed_F.png",
    type: "",
    noGift: true,
  },
  {
    id: "Fan_F",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Fan_F.gif",
    type: "",
    noGift: true,
  },
  {
    id: "Nightstand_F",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Nightstand_F.png",
    type: "",
    noGift: true,
  },
  {
    id: "Shelf_F",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Shelf_F.png",
    type: "",
    noGift: true,
  },
  {
    id: "UltrafragolaMirror_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/UltrafragolaMirror_M.png",
    type: "",
    noGift: true,
  },
  {
    id: "Candle_3_G",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Candle_3_G.png",
    type: "",
  },
  {
    id: "GreenJuice_G",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/GreenJuice_G.png",
    type: "",
  },
  {
    id: "IcedLatte_G",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/IcedLatte_G.png",
    type: "",
  },
  {
    id: "Journal_G",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Journal_G.png",
    type: "",
  },
  {
    id: "LemonWater_G",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/LemonWater_G.png",
    type: "",
  },
  {
    id: "Matcha_G",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Matcha_G.png",
    type: "",
  },
  {
    id: "PampasGrass_G",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/PampasGrass_G.png",
    type: "",
  },
  {
    id: "Succulent_G",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Succulent_G.png",
    type: "",
  },
  {
    id: "Art_1_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Art_1_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "Art_2_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Art_2_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "Art_3_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Art_3_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "Art_4_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Art_4_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "Art_5_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Art_5_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "Art_6_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Art_6_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "Art_7_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Art_7_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "AthleticGreens_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/AthleticGreens_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "Books_1_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Books_1_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "Camera_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Camera_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "Candle_1_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Candle_1_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "Candle_2_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Candle_2_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "ClawClip_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/ClawClip_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "Eucalyptus_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Eucalyptus_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "Hat_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Hat_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "IceRoller_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/IceRoller_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "Lamp_1_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Lamp_1_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "Lamp_2_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Lamp_2_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "MiniSkincareHolder_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/MiniSkincareHolder_M.gif",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "Monstera_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Monstera_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "MushroomDecor_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/MushroomDecor_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "NailClippers_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/NailClippers_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "OlaplexOil_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/OlaplexOil_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "Pothos_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Pothos_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "Probiotics_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Probiotics_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "RingLight_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/RingLight_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "RoseVase_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/RoseVase_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "Rug_1_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Rug_1_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "Shoes_1_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Shoes_1_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "Slides_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Slides_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "Supergoop_1_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Supergoop_1_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "Supergoop_2_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Supergoop_2_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "TableMirror_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/TableMirror_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "Throw_1_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Throw_1_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "Throw_2_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Throw_2_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "Towel_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Towel_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "Tula_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/Tula_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "TulipVase_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/TulipVase_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "UggSlippers_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/UggSlippers_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "WaterBottle_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/WaterBottle_M.png",
    type: "MOVE",
    noGift: true,
  },
  {
    id: "YogaMat_M",
    url: "https://storage.googleapis.com/is-this-thing-on/molly/YogaMat_M.png",
    type: "MOVE",
    noGift: true,
  },
];

export function bhavikShouldNeverCodeAgain() {
  const roomDocRef = roomDoc("molly");
  const dbStickerCDN = stickerCDNCollection(roomDocRef);

  for (let i =0 ; i < MollyAssetsJson.length; i++) {
    let asset = MollyAssetsJson[i];
    let id = asset.id;

    let assetDoc = doc(dbStickerCDN, id);
    setDoc(assetDoc, {url: asset.url, type: asset.type, noGift: asset.noGift || false, size: 0.1})
  }
}

export function butWeMayAsWellDoItAll() {
  for (let i =0; i< MollyAssetsJson.length; i++) {
    let asset = MollyAssetsJson[i];
    let id = asset.id;
    addStickerInstance("molly", {cdnID: id, position: [Math.random(), Math.random()], timestamp: Date.now(), zIndex: 100})
  }
}