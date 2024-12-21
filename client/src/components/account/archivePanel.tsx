import { useEffect, useState } from "react";
import { onRecordingsUpdate } from "../../lib/firestore/recordings";

const ArchivePanel: React.FC<{ roomID: string }> = ({ roomID }) => {
    const [expanded, setExpanded] = useState(false);
    return (
        <div className="stack:s-1">
            <div className="horizontal-stack cursor:pointer greenFill inline-block" onClick={() => setExpanded(!expanded)}>
                <div>{expanded ? "-" : "+"}</div>
                <div>Recording controls</div>
            </div>
            {expanded && (
                <div className="stack:s-1">
                    <ViewArchive roomID={roomID} />
                </div>
            )}
        </div>
    );
};


function formatTimeRange(startTime?: string, endTime?: string) {
    if (!startTime || !endTime) return "??";

    const start = new Date(startTime);
    const end = new Date(endTime);

    const dateOptions: Intl.DateTimeFormatOptions = {
        month: 'numeric',
        day: 'numeric'
    };

    // Same day formatting
    if (start.toDateString() === end.toDateString()) {
        return `${start.toLocaleDateString(undefined, dateOptions)} ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    // Different days
    return `${start.toLocaleDateString(undefined, dateOptions)} ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleDateString(undefined, dateOptions)} ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}


const ViewArchive: React.FC<{ roomID: string }> = ({ roomID }) => {
    const [recordings, setRecordings] = useState<Recording[]>([]);
    useEffect(() => {
        onRecordingsUpdate(roomID, setRecordings);
    }, [roomID]);
    if (recordings.length == 0) return <div>No recordings found</div>;
    return <div className="stack:s-2">
        <div>Recordings</div>
        {recordings.map((recording, index) => (
            <div><a href={recording.url} target="_blank" className="underline" rel="noopener noreferrer">{index + 1}. {formatTimeRange(recording.startTime, recording.endTime)}</a></div>
        ))}
    </div>;
};

export default ArchivePanel;
