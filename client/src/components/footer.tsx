import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useUserStore } from "../stores/userStore";
import streamNames from "../../../common/streamData";
import Transactions from "./transactions";
import useEnergyStore from "../stores/energyStore";

const Footer: React.FunctionComponent = () => {
  return (
    <footer className="align-end padded">
      <div className="fullWidth">
        <div className="marquee"> is this thing on </div>
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
          <UserDisplay />
        </div>
      </div>
    </footer>
  );
};
const UserDisplay: React.FunctionComponent = () => {
  const currentUser = useUserStore(state => state.currentUser);
  const currentUserEnergy = useEnergyStore(state => state.currentUserEnergy)
  return (
    <div className="horizontal-stack">
      <Link href="/auth">{currentUser ? currentUser.email :  "login"}</Link>
      <div> {currentUserEnergy !== undefined ? `${currentUserEnergy} NRG` : null} </div>
    </div>)
};
export default Footer;
