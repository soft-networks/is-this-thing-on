import { useCallback, useEffect, useState } from "react";

import { logInfo } from "../../lib/logger";
import { useRoomStore } from "../../stores/currentRoomStore";

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
  const [consentPassed, setConsentPassed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`consent-${roomID}`) === 'true';
    }
    return false;
  });

  // Update localStorage whenever consent changes
  useEffect(() => {
    if (typeof window !== 'undefined' && consentPassed == true) {
      localStorage.setItem(`consent-${roomID}`, consentPassed.toString());
    }
  }, [consentPassed, roomID]);

  
  return consentPassed ? (
    <>{children}</>
  ) : (
    <div className="fullBleed absolute faintWhiteFill highestLayer" key={`content-gate-${roomID}`}>
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
            className="clickable padded lightFill border contrastFill greenFill:hover"
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
