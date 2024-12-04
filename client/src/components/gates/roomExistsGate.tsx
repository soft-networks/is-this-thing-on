import { useCallback, useMemo } from "react";
import useGlobalRoomsInfoStore from "../../stores/globalRoomsInfoStore";

const RoomExistsGate: React.FunctionComponent<{ id: string }> = ({
    id,
    children,
}) => {
    const ring = useGlobalRoomsInfoStore(useCallback((room) => room.rooms, []));
    const isValidName = useMemo(() => {
        if (ring == undefined || Object.keys(ring).length == 0) {
            return <div className="center:absolute">loading...</div>;
            ;
        }
        const streamNames = Object.keys(ring);
        return streamNames.includes(id);
    }, [ring, id]);
    console.log("isValidName", isValidName);
    return isValidName ? (
        <> {children} </>
    ) : (
        <div className="center:absolute"> whoops, ur lost. </div>
    );
};

export default RoomExistsGate;