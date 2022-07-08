import { useRouter } from "next/router";


const useCurrentStreamName = () => {
  const router = useRouter();
  const { id } = router.query;
  return id as string;
}

export default useCurrentStreamName;