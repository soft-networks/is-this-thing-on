import Link from "next/link";
import { useEffect, useState } from "react";
import { syncAllArchives } from "../../lib/firestore/archive";

const ArchiveViewer: React.FC = () => {
  const [archives, setArchives] = useState<ArchiveInfo[]>([]);

  useEffect(() => {
    const unsub = syncAllArchives(setArchives);
    return () => unsub();
  }, []);

  if (archives.length === 0) return null;

  return (
    <div className="stack:s-1 h2">
      {archives.map((archive) => (
        <p key={archive.archiveID}>
          <Link href={`/archive/${archive.archiveID}`} >
            <span className="stack:noGap cursor:pointer greenFill:hover underline">
              {archive.name}
            </span>
            
          </Link>
        </p>
      ))}
    </div>
  );
};

export default ArchiveViewer;
