import classNames from "classnames";
import { Unsubscribe } from "firebase/firestore";
import { MouseEventHandler, useEffect, useRef, useState, useCallback } from "react";
import { addInteractiveElement, syncInteractiveElements } from "../lib/firestore";
import { useRoomStore } from "../stores/roomStore";
import useTransactionStore from "../stores/transactionStore";
import { useUserStore } from "../stores/userStore";

const Coins: React.FC = () => {
  const [newCoinPositions, setCoinPositions] = useState<Pos[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const userID = useUserStore(useCallback((state) => state.currentUser?.uid, []));
  const roomID = useRoomStore(useCallback((state) => state.currentRoomID, []));

  //on unmount just clear out any unfinished
  useEffect(() => {
    return () => setCoinPositions([]);
  }, []);
  
  const addCoin: MouseEventHandler<HTMLDivElement> = (e) => {
    if (containerRef.current && userID) {
      let bounds = containerRef.current.getBoundingClientRect();
      let x = e.pageX / bounds.width;
      let y = e.pageY / bounds.height;
      let p: Pos = [x, y];
      setCoinPositions((cp) => [...cp, p]);
    }
  };
  return roomID ? (
    <div className="fullBleed absoluteOrigin" onClick={addCoin} ref={containerRef}>
      {userID &&
        newCoinPositions.map((c, i) => (
          <NewCoin key={`coin-${c[0]}-${c[1]}`} pos={c} userID={userID} roomID={roomID} />
        ))}
        <ServerCoins roomID={roomID} key={`${roomID}-sscoins`}/>
    </div>
  ) : null;
};

const NewCoin: React.FC<{ pos: Pos; userID: UserID; roomID: string }> = ({ pos, userID, roomID }) => {
  const [status, setStatus] = useState<TransactionStatusTypes>("PENDING");
  const postTransaction = useTransactionStore(useCallback((state) => state.postTransaction, []));

  const transactionPosted = useRef<boolean>();

  const newCoinStatusUpdated = useCallback(
    (status: TransactionStatus) => {
      if (status.type == "SUCCESS") {
        const newCoin: InteractiveElement = {
          position: pos,
          behaviorType: "COIN",
          cdnID: "COIN",
          timestamp: Date.now(),
        };
        addInteractiveElement(roomID, newCoin);
      }
      setStatus(status.type);
    },
    [setStatus, roomID, pos]
  );

  useEffect(() => {
    if (userID && !transactionPosted.current) {
      const coinTransaction: EnergyTransaction = {
        from: userID,
        to: "CENTRAL_BANK",
        amount: 1,
        timestamp: Date.now(),
      };
      postTransaction(coinTransaction, newCoinStatusUpdated);
      transactionPosted.current = true;
    }
  }, [newCoinStatusUpdated, postTransaction, userID]);

  return (
    <CoinRenderer
      className={classNames({
        grayFill: status == "PENDING",
        green: status == "SUCCESS",
        hide: status == "ERROR",
      })}
      pos={pos}
    />
  );
};

const ServerCoins: React.FC<{ roomID: string }> = ({ roomID }) => {
  let [serverSideCoins, setServerSideCoins] = useState<{ [key: string]: InteractiveElement }>({});
  const unsub = useRef<Unsubscribe>();

  const addCoin = useCallback(
    (cID, element) => {
      setServerSideCoins((pc) => {
        let npc = { ...pc };
        npc[cID] = element;
        return npc;
      });
    },
    [setServerSideCoins]
  );
  const removeCoin = useCallback(
    (cID) =>
      setServerSideCoins((pc) => {
        let npc = { ...pc };
        delete npc[cID];
        return npc;
      }),
    [setServerSideCoins]
  );
  useEffect(() => {
    async function setupServerSync() {
      unsub.current = syncInteractiveElements(roomID, "COIN", addCoin, removeCoin);
    }
    setupServerSync();
    return () => unsub.current && unsub.current();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {Object.entries(serverSideCoins).map(([id, coin]) => (
        <CoinRenderer key={`servercoin-${id}`} pos={coin.position} className="contrastFill" />
      ))}
    </>
  );
};

const CoinRenderer = ({ className, pos}: {className: string, pos: Pos}) => {
  return ( pos ? 
    <div style={{ left: `${pos[0] * 100}%`, top: `${pos[1] * 100}%` }} className={className + " absoluteOrigin"}>
      c
    </div> : <span></span>
  );
};

export default Coins;
