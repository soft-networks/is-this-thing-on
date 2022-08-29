import { Unsubscribe } from "firebase/firestore";
import { useRef, useCallback, useEffect } from "react";
import { syncEnergyAccount } from "../lib/firestore";
import useEnergyStore from "../stores/energyStore";
import { useUserStore } from "../stores/userStore";

const Energy : React.FunctionComponent = () => {
  const currentUserEnergy = useEnergyStore(state => state.currentUserEnergy)
  const setCurrentUserEnergy = useEnergyStore(useCallback((state) => state.setCurrentUserEnergy, []));
  const unsub = useRef<Unsubscribe>();
  const userID = useUserStore(useCallback(state => state.currentUser?.uid, []));

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

  return (
    <div> {currentUserEnergy !== undefined ? `${currentUserEnergy} NRG` : null} </div>
  )
}

export default Energy;