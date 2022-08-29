import Link from "next/link";
import React from "react";
import roomNames from "../../../common/commonData";
import Energy from "../components/energy";
import Account from "../components/account";

const Footer: React.FunctionComponent = () => {
  return (
    <footer className="align-end padded">
      <div className="fullWidth">
        <div> is this thing on </div>
      </div>
      <div className="horizontal-stack fullWidth">
        <div className="horizontal-stack">
        {roomNames.map((name) => (
          <div key={`isto-status-${name}`}>
            <Link href={`/streams/${name}`}>{name}</Link>
          </div>
        ))}
        </div>
        <div className="align-end horizontal-stack">
          <Account /><Energy/>
        </div>
      </div>
    </footer>
  );
};



export default Footer;
