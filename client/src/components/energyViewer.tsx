import { useCallback, useEffect, useRef, useState } from "react";
import useEnergyStore from "../stores/energyStore";
import { useUserStore } from "../stores/userStore";
import { Transaction, Unsubscribe } from "firebase/firestore";
import { syncEnergyAccount, syncTransactionStatus } from "../lib/firestore";
import { prependListener } from "process";
import classnames from "classnames";

const EnergyViewer: React.FC = ({}) => {
  const userID = useUserStore(useCallback((state) => state.currentUser?.uid, []));
  const currentUserEnergy = useEnergyStore(useCallback((state) => state.currentUserEnergy, []));
  const setCurrentUserEnergy = useEnergyStore(useCallback((state) => state.setCurrentUserEnergy, []));
  const transact = useEnergyStore(useCallback((state) => state.transact, []));
  const unsub = useRef<Unsubscribe>();
  const [pendingTransactions, setPendingTransactions] = useState<EnergyTransactionPosted[]>([]);

  const removeTransactionFromPending = (id: string) => {
    setPendingTransactions((p) => {
      let newP = p.filter(t => t.id !== id);
      return newP;
    });
  };
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
  const gimmeEnergy = async () => {
    if (userID) {
      console.log("Sending transaction");
      let result = await transact({
        from: "CENTRAL_BANK",
        to: userID,
        timestamp: Date.now(),
        amount: 1,
      });
      if (result.status.type == "PENDING") {
        setPendingTransactions((p) => ([...p, result]));
      } else {
        console.error(" posting a transaction failed", result);
      }
    }
  };
  const sendEnergy = async () => {
    if (userID) {
      console.log("Sending transaction");
      let result = await transact({
        from:  userID,
        to: "CENTRAL_BANK",
        timestamp: Date.now(),
        amount: 1,
      });
      if (result.status.type == "PENDING") {
        setPendingTransactions((p) => ([...p, result]));
      } else {
        console.error(" posting a transaction failed", result);
      }
    }
  }
  return userID == undefined ? null : (
    <>
      <div className="stack:horizontal">
        <div> {currentUserEnergy} </div>
        <div className="clickable" onClick={gimmeEnergy}>
          gimme
        </div>
        <div className="clickable" onClick={sendEnergy}>
          send
        </div>
      </div>
      <div className="stack padded" style={{ position: "fixed", top: 0, right: 0, zIndex: 5 }}>
        {pendingTransactions.map((t, i) => (
          <PendingTransaction
            key={`transaction-${i}`}
            transaction={t}
            onTransactionCompleted={removeTransactionFromPending}
          />
        ))}
      </div>
    </>
  );
};

const PendingTransaction: React.FC<{
  transaction: EnergyTransactionPosted;
  onTransactionCompleted: (id: string) => void;
}> = ({transaction, onTransactionCompleted}) => {

  const [status, setStatus] = useState<TransactionStatus>( transaction.status);

  const unsub = useRef<Unsubscribe>();

  const handleStatusChange = useCallback((newStatus: TransactionStatus) => {
    setStatus(newStatus)
    if (newStatus.type == "SUCCESS") {
      if (unsub.current) {
        unsub.current();
        unsub.current = undefined;
      }
      setTimeout(() => onTransactionCompleted(transaction.id), 1000);
    }
  }, [onTransactionCompleted, transaction.id]);

  useEffect(() => {
    async function setupTransactionSync(){
      unsub.current = await syncTransactionStatus(transaction.id, handleStatusChange);
    }
    setupTransactionSync();
    return () => unsub.current && unsub.current();
  }, [transaction.id, handleStatusChange]);

  return (
    <div className={classnames({red: status.type !== "SUCCESS", green: status.type == "SUCCESS"})}>
     transaction: {transaction.amount} at {transaction.timestamp} <br/>
     status: {status.type}
    </div>
  );
};
export default EnergyViewer;
