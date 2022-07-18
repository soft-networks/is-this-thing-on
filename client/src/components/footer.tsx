import Link from "next/link";
import React from "react";
import streamNames from "../../../common/streamData";
import EnergyDisplay from "./energyDisplay";
import UserDisplay from "./userDisplay";

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



export default Footer;
