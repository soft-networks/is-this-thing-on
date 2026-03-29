import { useEffect } from "react";
import useArchiveStore from "../../stores/archiveStore";
import { syncArchiveInfo, syncArchiveRooms } from "../../lib/firestore/archive";

const ArchiveProvider: React.FC<{ archiveID: string; children: React.ReactNode }> = ({
  archiveID,
  children,
}) => {
  const setArchiveInfo = useArchiveStore((s) => s.setArchiveInfo);
  const setRooms = useArchiveStore((s) => s.setRooms);
  const clearArchive = useArchiveStore((s) => s.clearArchive);

  useEffect(() => {
    const unsubInfo = syncArchiveInfo(archiveID, setArchiveInfo);
    const unsubRooms = syncArchiveRooms(archiveID, setRooms);

    return () => {
      unsubInfo();
      unsubRooms();
      clearArchive();
    };
  }, [archiveID, setArchiveInfo, setRooms, clearArchive]);

  return <>{children}</>;
};

export default ArchiveProvider;
