import { useCallback, useMemo } from "react";
import useGlobalRoomsInfoStore from "../../stores/globalRoomsInfoStore";

const RoomExistsGate: React.FunctionComponent<{ id: string }> = ({
    id,
    children,
}) => {
    // Only select the specific room's existence instead of the entire rooms object
    const roomExists = useGlobalRoomsInfoStore(
        useCallback((state) => Boolean(state.rooms?.[id]), [id])
    );

    return roomExists ? (
        <>{children}</>
    ) : (
        <div className="center:absolute">whoops, ur lost.</div>
    );
};

export default RoomExistsGate;