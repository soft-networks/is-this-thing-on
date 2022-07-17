import { useCallback, useEffect, useRef, useState } from "react";
import useEnergyStore from "../stores/energyStore";
import { useUserStore } from "../stores/userStore";
import {  Unsubscribe } from "firebase/firestore";
import { syncEnergyAccount, syncTransactionStatus } from "../lib/firestore";
import classnames from "classnames";

const Transactions: React.FC = ({}) => {
  const userID = useUserStore(useCallback((state) => state.currentUser?.uid, []));
  const setCurrentUserEnergy = useEnergyStore(useCallback((state) => state.setCurrentUserEnergy, []));
  const transact = useEnergyStore(useCallback((state) => state.transact, []));
  const unsub = useRef<Unsubscribe>();
  const [pendingTransactions, setPendingTransactions] = useState<EnergyTransactionPosted[]>([]);

  useEffect(() => {
    async function setupEnergySync() {
      if (userID) {
        if (unsub.current) {
          unsub.current();
        }
        unsub.current = await syncEnergyAccount(userID, (account) => setCurrentUserEnergy(account.energy));
      }
    }
    setupEnergySync();
    return () => unsub.current && unsub.current();
  }, [setCurrentUserEnergy, userID]);
  const removeTransactionFromPending = (id: string) => {
    setPendingTransactions((p) => {
      let newP = p.filter((t) => t.id !== id);
      return newP;
    });
  };
  const testTransaction = async (transaction: EnergyTransaction) => {
    if (userID) {
      console.log("Sending transaction");
      let result = await transact(transaction);
      if (result.status.type == "PENDING") {
        setPendingTransactions((p) => [...p, result]);
      } else {
        console.error(" posting a transaction failed", result);
      }
    }
  }
  return userID == undefined ? null : (
    <div className="stack padded:s-1" style={{ position: "fixed", top: 0, right: 0, zIndex: 5 }}>
      <div className="horizontal-stack align-end">
        <div> test! </div>
        <div
          className="button"
          onClick={() => testTransaction({ from: "CENTRAL_BANK", to: userID, timestamp: Date.now(), amount: 1 })}
        >
          gimme 1
        </div>
        <div
          className="button"
          onClick={() => testTransaction({ to: "CENTRAL_BANK", from: userID, timestamp: Date.now(), amount: 1 })}
        >
          send 1
        </div>
      </div>
      {pendingTransactions.map((t, i) => (
        <PendingTransaction
          key={`transaction-${i}`}
          transaction={t}
          onTransactionCompleted={removeTransactionFromPending}
        />
      ))}
    </div>
  );
};

const PendingTransaction: React.FC<{
  transaction: EnergyTransactionPosted;
  onTransactionCompleted: (id: string) => void;
}> = ({ transaction, onTransactionCompleted }) => {
  const [status, setStatus] = useState<TransactionStatus>(transaction.status);

  const unsub = useRef<Unsubscribe>();

  const handleStatusChange = useCallback(
    (newStatus: TransactionStatus) => {
      setStatus(newStatus);
      if (newStatus.type == "SUCCESS") {
        if (unsub.current) {
          unsub.current();
          unsub.current = undefined;
        }
        setTimeout(() => onTransactionCompleted(transaction.id), 1000);
      }
    },
    [onTransactionCompleted, transaction.id]
  );

  useEffect(() => {
    async function setupTransactionSync() {
      unsub.current = await syncTransactionStatus(transaction.id, handleStatusChange);
    }
    setupTransactionSync();
    return () => unsub.current && unsub.current();
  }, [transaction.id, handleStatusChange]);

  return (
    <div className={classnames({ red: status.type !== "SUCCESS", green: status.type == "SUCCESS" })}>
      transaction: {transaction.amount} at {transaction.timestamp} <br />
      status: {status.type}
    </div>
  );
};
export default Transactions;
