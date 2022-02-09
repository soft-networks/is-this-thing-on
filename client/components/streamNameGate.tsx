import useCurrentStreamName from "../useHooks/useCurrentStreamName";
import { useStreamNames } from "../useHooks/useStreamNames";


const StreamNameGate: React.FunctionComponent = ({ children }) => {
  const id = useCurrentStreamName();
  const streamNames = useStreamNames();
  const isStreamValid = streamNames.includes(id);
  return isStreamValid ? <> {children} </> : <div> Sorry, thats not a valid stream name </div>;
};

export default StreamNameGate;
