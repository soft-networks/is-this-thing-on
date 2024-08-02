import { useCallback, useEffect, useState } from "react";
import useConsentStore from "../../stores/consentStore";
import { logInfo } from "../../lib/logger";
import { useRoomStore } from "../../stores/roomStore";

const ConsentGate: React.FC<{ roomID: string; consentURL?: string }> = ({
  roomID,
  children,
  consentURL,
}) => {
  return consentURL ? (
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
  const consent = useConsentStore(useCallback((s) => s.consent, []));
  const setConsent = useConsentStore(useCallback((s) => s.setConsent, []));
  const [consentPassed, setConsentPassed] = useState<boolean>(false);
  useEffect(() => {
    if (consent.includes(roomID)) {
      logInfo("Consent Accepted for" + roomID);
      setConsentPassed(true);
    }
  }, [consent, roomID]);
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
              console.log("SETTING", roomID);
              setConsent(roomID);
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
