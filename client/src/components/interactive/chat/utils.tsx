export const CHAT_HEIGHT = 0.5;

export const DEFAULT_STYLE = (roomColor: string, globalStyle: boolean) =>
    ({
        "--chatAuthorColor": globalStyle ? "yellow" : "var(--contrast)",
        "--chatMessageColor": "var(--black)",
        "--chatContainerBackground": "none",
        "--chatBorderColor": "var(--gray)",
        "--chatMessageBackgroundColor": "var(--roomColor)",
    }) as React.CSSProperties;


export const getRoomNameForChat = (roomName: string) => {
    let rn = `${roomName}`;
    if (roomName.charAt(roomName.length - 1) == "s") {
        rn += "'";
    } else {
        rn += "'s";
    }
    rn += "";
    return rn;
};