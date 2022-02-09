//Create a provider that provides stream names

import React, { createContext, useContext, useEffect, useState } from "react";
import { getStreamNames } from "./server-api";

interface StreamNames {
  names?: string[];
}

export const StreamNameContext = createContext<StreamNames>({});

export const StreamNameProvider: React.FunctionComponent = ({ children }) => {
  const [streamNames, setStreamNames] = useState<string[]>([]);
  useEffect(() => {
    getStreamNames().then((data) => {
      if (data)
        setStreamNames((prevState) => {
          console.log("Updating stream names");
          return [...data];
        });
    });
  }, []);
  return <StreamNameContext.Provider value={{ names: streamNames }}> {children} </StreamNameContext.Provider>;
};

export const useStreamData = () => {
  const context = useContext(StreamNameContext);
  return context;
}

//Create a hook useStreamNames that uses the StreamNameContext
export const useStreamNames = () => {
  const context = useContext(StreamNameContext);
  if (context.names === undefined) {
    return [];
  }
  return context.names;
};
