import Link from "next/link";
import { useStreamNames } from "../lib/streamNameProvider";

const IsThisThingOnFooter: React.FunctionComponent = () => {
  const streamNames = useStreamNames();
  return (
    <footer>
      <em> is this thing on </em>
      <ul>
        {streamNames.map((name) => (
          <li key={`isto-status-${name}`}> <Link href={`/streams/${name}`}>{name}</Link> </li>
        ))}
      </ul>
    </footer>
  );
};

export default IsThisThingOnFooter;
