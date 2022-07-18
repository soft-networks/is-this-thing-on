import Link from "next/link";
import React, { useEffect, useState, useCallback, useRef} from "react";
import { useUserStore } from "../stores/userStore";
import streamNames from "../../../common/streamData";
import useEnergyStore from "../stores/energyStore";
import { Unsubscribe } from "firebase/firestore";
import { syncEnergyAccount } from "../lib/firestore";

const Footer: React.FunctionComponent = () => {
  return (
    <footer className="align-end padded">
      <div className="fullWidth">
        <div> is this thing on </div>
      </div>
      <div className="horizontal-stack fullWidth">
        <div className="horizontal-stack">
        {streamNames.map((name) => (
          <div key={`isto-status-${name}`}>
            <Link href={`/streams/${name}`}>{name}</Link>
          </div>
        ))}
        </div>
        <div className="align-end horizontal-stack">
          <UserDisplay /><EnergyDisplay/>
        </div>
      </div>
    </footer>
  );
};
const UserDisplay: React.FunctionComponent = () => {
  const currentUser = useUserStore(state => state.currentUser);
  return (
      <Link href="/auth">{currentUser ? currentUser.email :  "login"}</Link>
  )
};

const EnergyDisplay : React.FunctionComponent = () => {
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

export default Footer;
