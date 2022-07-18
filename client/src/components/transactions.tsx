import { useCallback, useEffect, useRef, useState } from "react";
import useEnergyStore from "../stores/energyStore";
import { useUserStore } from "../stores/userStore";
import {  Unsubscribe } from "firebase/firestore";
import { syncEnergyAccount, syncTransactionStatus } from "../lib/firestore";
import classnames from "classnames";
import useTransactionStore from "../stores/transactionStore";

const Transactions: React.FC = ({}) => {
  const pendingTransactions = useTransactionStore(useCallback(state => ([...state.pendingTransactions]), []));
  return  (
    <div className="stack padded:s-1" style={{ position: "fixed", top: 0, right: 0, zIndex: 5 }}>
      <TransactionTester />
      {pendingTransactions.map((t, i) => (
        <PendingTransaction
          key={`transaction-${t.id}`}
          transaction={t}
        />
      ))}
    </div>
  );
};

const TransactionTester: React.FC = () => {
  const postTransaction = useTransactionStore(useCallback((state) => state.postTransaction, []));
  const userID = useUserStore(useCallback(state => state.currentUser?.uid ,[]));
  return userID == undefined ? null : (
    <div className="horizontal-stack justify-end lightFill">
    <div> energy test </div>
    <div
      className="button"
      onClick={() => postTransaction({ from: "CENTRAL_BANK", to: userID, timestamp: Date.now(), amount: 1 }, () => console.log("YAYYYy"))}
    >
      gimme 1
    </div>
    <div
      className="button"
      onClick={() => postTransaction({ to: "CENTRAL_BANK", from: userID, timestamp: Date.now(), amount: 1 }, () => console.log("NOOOOOO"))}
    >
      send 1
    </div>
  </div>
  )
}
const PendingTransaction: React.FC<{
  transaction: EnergyTransactionPosted;
}> = ({ transaction }) => {
  
  const unsub = useRef<Unsubscribe>();
  const timeoutHandler = useRef<NodeJS.Timeout>();
  const updateTransactionStatusLocal = useTransactionStore(useCallback(state => state.updateTransactionStatusLocal, []));
  const transactionCompleteCallback = useTransactionStore(useCallback(state => state.transactionCompleteActionCallback[transaction.id], [transaction.id]));
  const removeTransaction = useTransactionStore(useCallback(state => state.removeTransaction,[]));
  
  const timeoutTransaction = useCallback( () => {
    updateTransactionStatusLocal(transaction.id, {type: "ERROR", code: "TIMEOUT"})
  }
  ,[transaction.id, updateTransactionStatusLocal])
  const handleServerSideStatusChange = useCallback(
    (newStatus: TransactionStatus) => {
      if (newStatus.type == "SUCCESS") {
        updateTransactionStatusLocal(transaction.id, newStatus);
        timeoutHandler.current && clearTimeout(timeoutHandler.current);
        if (unsub.current) {
          unsub.current();
          unsub.current = undefined;
        }
        if (transactionCompleteCallback) {
          transactionCompleteCallback(newStatus);
        };
        setTimeout(() => removeTransaction(transaction.id), 1000);
      }
    },
    [removeTransaction, transaction.id, transactionCompleteCallback, updateTransactionStatusLocal]
  );
  useEffect(() => {
    console.log("Transaction mounted");
    async function setupTransactionSync() {
      unsub.current && unsub.current();
      unsub.current = await syncTransactionStatus(transaction.id, handleServerSideStatusChange);

      timeoutHandler.current && clearTimeout(timeoutHandler.current);
      timeoutHandler.current = setTimeout(timeoutTransaction, 5 * 1000);
    }
    setupTransactionSync();
    return () => unsub.current && unsub.current();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={classnames({
        red: transaction.status.type == "ERROR",
        green: transaction.status.type == "SUCCESS",
        fadeOut: transaction.status.type == "SUCCESS",
        grayFill: transaction.status.type == "PENDING"
      })}
    >
      transaction: {transaction.amount} at {transaction.timestamp} <br />
      status: {transaction.status.type} {transaction.status.code || ""}
    </div>
  );
};
export default Transactions;
