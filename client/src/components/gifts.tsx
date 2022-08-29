import useTransactionStore from "../stores/transactionStore";
import { useCallback } from "react";
import { useUserStore } from "../stores/userStore";
import { addInteractiveElement } from "../lib/firestore";
import { useRoomStore } from "../stores/roomStore";


const Gifts : React.FC  = () => {
  const roomID = useRoomStore(useCallback(state => state.currentRoomID,[]));
  return (<div > <GiftChooser roomID={roomID} /> </div>)
}


type GiftSelectionOption = {cost: number, cdnID: string};
const GiftOptions: GiftSelectionOption[] = [
  { cost: 2, cdnID: "SMUSHMELLOW" },
  { cost: 1, cdnID: "EMPTY_CUP" },
];
const GiftChooser : React.FC<{roomID: string,}> = ({roomID}) => {
  const userID = useUserStore(useCallback(state => state.currentUser?.uid,[]));
  return userID ? (
    <div className="stack">
      {GiftOptions.map((go) => (
        <NewGift giftOption={go} key={`choose-${go.cdnID}`} userID={userID} roomID={roomID} />
      ))}
    </div>
  ) : null;
  ;
}
const NewGift: React.FC<{giftOption: GiftSelectionOption,  userID: string, roomID: string}> = ({giftOption, userID, roomID}) =>{
  const postTransaction = useTransactionStore(useCallback(state => state.postTransaction, []));
  const transactionCallback: TransactionCompleteCallback = useCallback((status) => {
    if (status.type == "SUCCESS") {
      console.log("SHOULD POST GIFT NOW!");
      const giftElement : InteractiveElement = {
        behaviorType: "GIFT",
        cdnID: giftOption.cdnID,
        timestamp: Date.now(),
        position: [Math.random(), Math.random()]
      }
      addInteractiveElement(roomID, giftElement);
    }
  }, [giftOption.cdnID, roomID])
  const postGiftTransaction = useCallback(() => {
    const transaction: EnergyTransaction = {
      timestamp: Date.now(),
      from: userID,
      to: "heRWtR5gpUWvij9QvgLfHR5FdtO2", 
      amount: giftOption.cost
    }
    postTransaction(transaction, transactionCallback )
  }, [giftOption.cost, postTransaction, transactionCallback, userID]);

  return (
    <div className="relative button" onClick={postGiftTransaction}>
      <div>
        gift: {giftOption.cdnID}
      </div>
      <div className="absoluteCaption caption  grayFill">
        cost: {giftOption.cost}
      </div>
    </div>

  )
} 

export default Gifts;

/**

- <GiftAdder>
  - Show GIFS with different cdn_ids
  - Select a new gift
    -> Transaction : Pay amount (locally stored)  
    -> On transaction complete, add Gift to server with random position
    
- <ServerGiftViewer>
  - Show all the gifts of course 
  - add, remove, **update** needed 
  - Can drag these objects which *updates* the server gift thing 



**/

