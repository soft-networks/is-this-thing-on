import create from "zustand";
import { performTransaction } from "../lib/firestore";


type TransactionCompleteCallback =  (status: TransactionStatus) => void
interface TransactionStoreState {
  pendingTransactions: EnergyTransactionPosted[];
  transactionCallbacks: {[key: string] : TransactionCompleteCallback }
  removeTransaction: (transactionID: string) => void;
  postTransaction: (
    transactionToPost: EnergyTransaction,
    onTransactionCompleteCallback?: TransactionCompleteCallback
  ) => void;
  updateTransactionStatusLocal: (id: string, transactionStatus: TransactionStatus) => void
}

const useTransactionStore = create<TransactionStoreState>(set => ({
  pendingTransactions: [],
  transactionCallbacks: {},
  removeTransaction: (transactionID:string) => {
    set(s => {
      let p = s.pendingTransactions;
      let newP = p.filter((t) => t.id !== transactionID);
      return {pendingTransactions: newP};
    })
  },
  postTransaction: async (transactionToPost, onTransactionCompleteCallback) => {
    let transactionPosted: EnergyTransactionPosted; 
    try {
      transactionPosted = await performTransaction(transactionToPost);      
    } catch (e) {
      console.error(" There was an error in transacting " , (e as Error).message);
      transactionPosted = { ...transactionToPost, id: "null", status: { type: "ERROR", code: "NETWORK_ERROR" } } as EnergyTransactionPosted  ;
    } 
    set((s) => {
      let newState: Partial<TransactionStoreState> = { pendingTransactions: [...s.pendingTransactions, transactionPosted] };
      if (onTransactionCompleteCallback && transactionPosted['id'] !== "null") {
        let newCallbacks = s.transactionCallbacks;
        newCallbacks[transactionPosted['id']] = onTransactionCompleteCallback;
        newState.transactionCallbacks = newCallbacks;
      }
      return newState;
    });
  },
  updateTransactionStatusLocal: (id, transactionStatus) => {
    set(s => {
      let pending = s.pendingTransactions;
      let index = pending.findIndex( t => t.id == id);
      if (index >= 0) {
        let tx = pending[index];
        let ntx = {...tx, status: transactionStatus};
        pending[index] = ntx;
      } 
      return {pendingTransactions: pending};
    })
  }
}));


export default useTransactionStore;