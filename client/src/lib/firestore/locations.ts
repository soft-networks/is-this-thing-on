import { collection, doc, DocumentReference } from "firebase/firestore";

import db from './init';

export function roomsCollection() {
  return collection(db, "rooms");
}
export function roomDoc(roomName: string) {
  // console.log("Room doc reference", roomName);
  return doc(db, "rooms", roomName);
}
export function energyAccountDoc(userID: string) {
 return doc(collection(db, "energy_accounts"), userID);
}
export function chatCollection(roomDoc: DocumentReference) {
  // console.log("Room chat doc reference", roomDoc);
  return collection(roomDoc, "chats");
}
export function elementCollection(roomDoc: DocumentReference) {
  return collection(roomDoc, "interactive_elements");
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
