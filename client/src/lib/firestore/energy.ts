import { addDoc, DocumentReference, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { sanitizeEnergyAccount, sanitizeTransactionForDB, sanitizeTransactionFromDB } from "./converters";
import { energyAccountDoc, transactionCollection, transactionDoc } from "./locations";

async function createEnergyAccount(docRef: DocumentReference) {
  const energyRef = await setDoc(docRef, { energy: 0 });
}
async function getOrCreateEnergyAccount(userID: string) {
  const energyAccountRef = energyAccountDoc(userID);
  const energyAccount = await getDoc(energyAccountRef);
  if (energyAccount.exists() && energyAccount.data()["energy"] != undefined) {
    return sanitizeEnergyAccount(energyAccount.data()["energy"], energyAccount.id);
  }
  await createEnergyAccount(energyAccountRef);
  return sanitizeEnergyAccount(0, userID);
}
export async function performTransaction(transaction: EnergyTransaction): Promise<EnergyTransactionPosted> {
  const transactionRef = await addDoc(transactionCollection(), sanitizeTransactionForDB(transaction));
  return {
    ...transaction,
    id: transactionRef.id,
    status: {
      type: "PENDING",
    },
  };
}
export async function syncEnergyAccount(userID: string, callback: (energyAccount: EnergyAccount) => void) {
  const account = await getOrCreateEnergyAccount(userID);
  callback(account);
  const unsub = onSnapshot(energyAccountDoc(userID), (doc) => {
    let data = doc.data();
    data && callback(sanitizeEnergyAccount(data["energy"], doc.id));
  });
  return unsub;
}
export async function syncTransactionStatus(transactionID: string, callback: (status: TransactionStatus) => void) {
  const unsub = onSnapshot(transactionDoc(transactionID), (doc) => {
    let data = doc.data();
    const sanitizedTransaction = sanitizeTransactionFromDB(data);
  
    callback(sanitizedTransaction.status);
  });
  return unsub;
}
