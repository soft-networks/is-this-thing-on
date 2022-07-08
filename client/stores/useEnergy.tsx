import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { disableUserSync, syncUser, updateUserRewards } from "../lib/firebase";


export const CollectiveContext = createContext<Collective>({
  rewards: 0,
  addReward: (amt: number) => {
    console.log("Using CollectiveContext incorrectly - use under Producer");
  },
  user: undefined,
  createUser: (str: string) => {
    console.log("Context not fulfilled");
  },
});

export const CollectiveProvider: React.FunctionComponent = ({ children }) => {
  const [rewards, setRewards] = useState<number>(0);
  const [user, setUser] = useState<undefined | string>();
  const [userWasSynced, setUserWasSynced] = useState<boolean>(false);

  const addReward = useCallback(
    (amt: number) => {
      if (user) {
        setRewards((prev) => {
          const newAmt = prev + amt;
          updateUserRewards(user, newAmt);
          return newAmt;
        });
      }
    },
    [setRewards, user]
  );

  useEffect(() => {
    console.log("change received?" + rewards);
  }, [rewards]);

  useEffect(() => {
    console.log("local user state updated..", user);
    if (user) {
      syncUser(user, (rewards) => {
        console.log("Received update from server sync");
        setUserWasSynced(true);
        setRewards(rewards);
      });
    }
    return () => {
      if (user) disableUserSync(user);
    };
  }, [user]);

  return (
    <CollectiveContext.Provider
      value={{ rewards, addReward, user: userWasSynced ? user : undefined, createUser: setUser }}
    >
      {children}
    </CollectiveContext.Provider>
  );
};

export const useCollective = () => {
  const context = useContext(CollectiveContext);
  return context;
};
