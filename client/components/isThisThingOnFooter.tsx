import Link from "next/link";
import { useRouter } from "next/router";
import { useStreamNames } from "../useHooks/useStreamNames";

const IsThisThingOnFooter: React.FunctionComponent = () => {
  const streamNames = useStreamNames();
  const router = useRouter();
  const {id} = router.query;
  return (
    <footer>
      <em> is this thing on </em>
      <ul>
        {streamNames.map((name) => (
          name !== (id as string) ? <li key={`isto-status-${name}`}> <Link href={`/streams/${name}`}>{name}</Link> </li> : null
        ))}
      </ul>
    </footer>
  );
};

export default IsThisThingOnFooter;
