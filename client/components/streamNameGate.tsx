import { useStreamNames } from "../lib/streamNameProvider";

interface StreamNameGateProps {
  id: string;
}
const StreamNameGate: React.FunctionComponent<StreamNameGateProps> = ({ id, children }) => {
  const streamNames = useStreamNames();
  const isStreamValid = streamNames.includes(id);
  return isStreamValid ? <> {children} </> : <div> Sorry, thats not a valid stream name </div>;
};

export default StreamNameGate;
