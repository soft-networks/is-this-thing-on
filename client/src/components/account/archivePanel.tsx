import { useEffect, useState, useRef, useCallback } from "react";
import { onRecordingsUpdate } from "../../lib/firestore/recordings";
import classnames from "classnames";
import { onArchiveURLUpdate, setArchiveURL, toggleArchiveMode } from "../../lib/archive";
import { useRoomStore } from "../../stores/currentRoomStore";
import { useCallStateHooks } from "@stream-io/video-react-sdk";

const ArchivePanel: React.FC<{ roomID: string }> = ({ roomID }) => {
    const [expanded, setExpanded] = useState(false);
    return (
        <div className="stack:s-1">
            <div className="horizontal-stack cursor:pointer greenFill inline-block" onClick={() => setExpanded(!expanded)}>
                <div>{expanded ? "-" : "+"}</div>
                <div>Recording controls</div>
            </div>
            {expanded && (
                <div className="stack">
                    <ViewArchive roomID={roomID} />
                    <SetArchiveURL roomID={roomID} />
                    <ActivateArchive roomID={roomID} />
                </div>
            )}
        </div>
    );
};



const SetArchiveURL: React.FC<{ roomID: string }> = ({ roomID }) => {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    const validateAndSubmit = () => {
        // Basic video URL validation - checks for common video extensions and query params
        const videoExtensions = /\.(mp4|webm|ogg|mov)(?:\?.*)?$/i;
        if (!url.match(videoExtensions)) {
            setError('Please enter a valid video URL');
            return;
        }
        setError('');
        setArchiveURL(roomID, url);
    };

    return (
        <div className="stack:s-2">
            <div>Set archive</div>
            <div className="horizontal-stack:s-1">
                <input 
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter archive url"
                    className="minTextWidthMedium"
                />
                <div 
                    className={classnames(
                        "padded:s-2 whiteFill clickable greenFill:hover border",
                        {"opacity:hover": !url}
                    )}
                    onClick={validateAndSubmit}
                >
                    Submit
                </div>
            </div>
            {error && <div className="red">{error}</div>}
        </div>
    );
};

const ActivateArchive: React.FC<{ roomID: string }> = ({ roomID }) => {
    const [archiveUrl, setArchiveUrl] = useState<string | null>(null);
    const unsubscribeRef = useRef<(() => void) | null>(null);
    const isArchiveMode = useRoomStore(useCallback((s) => s.roomInfo?.streamStatus === "archive", []));
    const {useIsCallLive} = useCallStateHooks();
    const isCallLive = useIsCallLive();


    useEffect(() => {
        unsubscribeRef.current = onArchiveURLUpdate(roomID, setArchiveUrl);
        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
            }
        };
    }, [roomID]);

    useEffect(() => {
        if (isArchiveMode) {
            toggleArchiveMode(roomID, true);
        }
    }, [isArchiveMode]);

    if (isCallLive) {
        return <div>Cannot activate archive mode, call is currently live</div>;
    }
    if (!archiveUrl) {
        return <div>Cannot activate archive mode, without valid archive URL</div>;
    }

    return (
        <div className="stack:s-2">
            <div><a href={archiveUrl} target="_blank" rel="noopener noreferrer" className="underline cursor:link">✔︎ archive url set</a></div>
            <div 
                className={classnames(
                    "padded:s-2 whiteFill clickable greenFill:hover border inline-block",
                    {"greenFill": isArchiveMode}
                )}
                onClick={() => {
                    toggleArchiveMode(roomID, !isArchiveMode);
                }}
            >
                {isArchiveMode ? "Deactivate" : "Activate"} Archive Mode
            </div>
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
    const unsubscribeRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        unsubscribeRef.current = onRecordingsUpdate(roomID, setRecordings);
        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
            }
        };
    }, [roomID]);
    if (recordings.length == 0) return <div>No recordings found</div>;
    return <div className="stack:s-2">
        <div>Recordings</div>
        {recordings.map((recording, index) => (
            <div>{index + 1}. <a href={recording.url} target="_blank" className="underline cursor:link" rel="noopener noreferrer">{formatTimeRange(recording.startTime, recording.endTime)}</a></div>
        ))}
    </div>;
};

export default ArchivePanel;
