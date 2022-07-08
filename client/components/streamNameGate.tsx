import useCurrentStreamName from "../stores/useCurrentStreamName";
import { useStreamNames } from "../stores/useStreamNames";


const StreamNameGate: React.FunctionComponent = ({ children }) => {
  const id = useCurrentStreamName();
  const streamNames = useStreamNames();
  const isStreamValid = streamNames.includes(id);
  return isStreamValid ? <> {children} </> : <div> Sorry, thats not a valid stream name </div>;
};

export default StreamNameGate;
