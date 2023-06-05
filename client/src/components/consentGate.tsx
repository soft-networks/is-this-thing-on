import { useCallback, useEffect, useState } from "react";
import useConsentStore from "../stores/consentStore";

const ConsentGate: React.FC<{ roomID: string; active: boolean }> = ({ roomID, children, active }) => {
  const consent = useConsentStore(useCallback((s) => s.consent, []));
  const setConsent = useConsentStore(useCallback((s) => s.setConsent, []));
  const [consentPassed, setConsentPassed] = useState<boolean>(false);
  
  useEffect(() => {
    console.log("consent updated", consent);
    if (consent.includes(roomID)) {
      setConsentPassed(true);
    }
  }, [consent, roomID])

  return (consentPassed || !active) ? (
    <>{children}</>
  ) : (
    <div className="fullBleed absolute faintWhiteFill everest">
      <div className="center:absolute stack padded" style={{ width: "80%", height: "70%" }}>
        <iframe src="http://softnet.works" className="flex-1" style={{ border: "1px solid black" }} />
        <div className="horizontal-stack">
          <div
            className="clickable padded lightFill border contrastFill:hover"
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
