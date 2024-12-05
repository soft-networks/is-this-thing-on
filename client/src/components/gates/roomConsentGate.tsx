import { useCallback, useState } from "react";

import { logInfo } from "../../lib/logger";
import { useRoomStore } from "../../stores/roomStore";

const ConsentGate: React.FC = ({
  children,
}) => {
  const roomID = useRoomStore(useCallback((s) => s.roomInfo?.roomID, []));
  const consentURL = useRoomStore(useCallback((s) => s.roomInfo?.consentURL, []));
  return consentURL && roomID ? (
    <ConsentGateInternal roomID={roomID} consentURL={consentURL}>
      {children}
    </ConsentGateInternal>
  ) : (
    <>{children}</>
  );
};

const ConsentGateInternal: React.FC<{ roomID: string; consentURL: string }> = ({
  roomID,
  children,
  consentURL,
}) => {
  const [consentPassed, setConsentPassed] = useState<boolean>(false);

  return consentPassed ? (
    <>{children}</>
  ) : (
    <div className="fullBleed absolute faintWhiteFill highestLayer">
      <div
        className="center:absolute stack padded"
        style={{ width: "80vw", height: "85vh" }}
      >
        <iframe
          src={consentURL}
          className="flex-1"
          style={{ border: "1px solid black" }}
        />
        <div className="horizontal-stack ">
          <div
            className="clickable padded lightFill border contrastFill contrastFill:hover"
            onClick={() => {
              logInfo("Consent Accepted for" + roomID);
              setConsentPassed(true);
            }}
          >
            proceed
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentGate;
