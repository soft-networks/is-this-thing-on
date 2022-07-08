import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useCollective } from "../stores/useEnergy";
import { useUserStore } from "../stores/userStore";
import { useStreamNames } from "../stores/useStreamNames";

const IsThisThingOnFooter: React.FunctionComponent = () => {
  const streamNames = useStreamNames();
  const router = useRouter();
  const { id } = router.query;

  return (
    <footer className="align-end padded">
      <div className="full-width">
        <div className="marquee"> is this thing on </div>
      </div>
      <div className="stack:horizontal full-width">
        <div className="stack:horizontal">
        {streamNames.map((name) => (
          <div key={`isto-status-${name}`} className={classNames({ blue: name === (id as string) })}>
            <Link href={`/streams/${name}`}>{name}</Link>
          </div>
        ))}
        <div className="link"> 
            <Link href={`/energy`}>energy</Link>
          </div>
        </div>
        <div className="align-end stack:horizontal">
          
          <UserDisplay />
        </div>
      </div>
    </footer>
  );
};

const UserDisplay: React.FunctionComponent = () => {
  const { rewards, user } = useCollective();
  const {currentUser} = useUserStore();

  return (
    <span>
      <Link href="/auth">{currentUser ? currentUser.email :  "login"}</Link> {currentUser && ":" + rewards}
    </span>)
};

const UserInput: React.FunctionComponent = ({}) => {
  const [tempUser, setTempUser] = useState<string>("");
  const { createUser } = useCollective();
  const [submitted, setIsSubmitted] = useState<boolean>(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempUser(e.target.value);
  };
  const onSubmit = () => {
    createUser(tempUser);
    setIsSubmitted(true);
  };
  return !submitted ? (
    <span>
      <input type="text" value={tempUser} onChange={onChange} placeholder="Enter name" />
      <span className="clickable" onClick={onSubmit}>
        submit
      </span>
    </span>
  ) : (
    <span> loading account.. </span>
  );
};
export default IsThisThingOnFooter;
