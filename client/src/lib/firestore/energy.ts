import {
  addDoc,
  DocumentReference,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

import { sanitizeTransactionForDB } from "./converters";
import { transactionCollection } from "./locations";

export async function performTransaction(
  transaction: EnergyTransaction,
): Promise<EnergyTransactionPosted> {
  const transactionRef = await addDoc(
    transactionCollection(),
    sanitizeTransactionForDB(transaction),
  );
  return {
    ...transaction,
    id: transactionRef.id,
    status: {
      type: "PENDING",
    },
  };
}
