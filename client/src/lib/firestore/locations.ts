import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
} from "firebase/firestore";

import db from "./init";

export function roomsCollection() {
  return collection(db, "rooms");
}
export function roomDoc(roomName: string) {
  // console.log("Room doc reference", roomName);
  return doc(db, "rooms", roomName);
}

export function chatCollection() {
  // console.log("Room chat doc reference", roomDoc);
  return collection(db, "chat");
}

export function sarahQuestionsCollection() {
  const sarahRoom = roomDoc("sarah");
  return collection(sarahRoom, "questions");
}

export function darlaSpinnerDoc() {
  const roomDocRef = roomDoc("messydarla");
  const collectionDocRef = collection(roomDocRef, "customSpinner");
  const spinnerRef = doc(collectionDocRef, "spinner");
  return spinnerRef;
}

export function stickerCDNCollection(roomDoc: DocumentReference) {
  return collection(roomDoc, "sticker_cdn");
}
export function stickerInstanceResetCollection(roomDoc: DocumentReference) {
  return collection(roomDoc, "stickers_reset");
}
export function stickerInstanceCollection(roomDoc: DocumentReference) {
  return collection(roomDoc, "stickers");
}
export function stickerInstanceDoc(
  stickerInstanceCollection: CollectionReference,
  id: string,
) {
  return doc(stickerInstanceCollection, id);
}
export function transactionCollection() {
  return collection(db, "energy_transactions");
}
export function transactionDoc(transactionID: string) {
  return doc(db, "energy_transactions", transactionID);
}
export function presenceCollection() {
  // console.log("Presence reference");
  return collection(db, "presence");
}
