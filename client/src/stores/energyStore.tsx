import create from "zustand";
import { performTransaction, verifyBalanceGreaterThanAmount } from "../lib/firestore";


interface EnergyStoreState {
  currentUserEnergy: number,
  setCurrentUserEnergy: (energy: number) => void,
  transact: (transaction: EnergyTransaction) => Promise<EnergyTransactionPosted>
}

const useEnergyStore = create<EnergyStoreState>((set) => ({
  currentUserEnergy: 0,
  setCurrentUserEnergy: energy => set({currentUserEnergy: energy}),
  transact: async (transaction) => {
    try {
      const canSendAmount = await verifyBalanceGreaterThanAmount(transaction.from, transaction.amount);
      if (!canSendAmount) {
        return {
          ...transaction,
          id: "null",
          status: { type: "ERROR", code: "INSUFFICIENT_BALANCE" },
        } as EnergyTransactionPosted;
      }
      let transactionPosted = await performTransaction(transaction);      
      return transactionPosted;
    } catch (e) {
      console.error(" There was an error in transacting " , (e as Error).message);
      return { ...transaction, id: "null", status: { type: "ERROR", code: "NETWORK_ERROR" } } as EnergyTransactionPosted  ;
    } 

  }
}))

export default useEnergyStore;