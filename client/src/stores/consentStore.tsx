//Create a store that stores user consent, which can be true or false. persist it. use zustand

import create from "zustand";
import { persist } from "zustand/middleware";

interface ConsentStore {
  consent: string[];
  setConsent: (consent: string) => void;
}

const useConsentStore = create<ConsentStore>()(
  persist(
    (set) => ({
      consent: [],
      setConsent: (c) =>
        set((p) => {
          if (!p.consent.includes(c)) {
            console.log("updating consent");
            return { consent: [...p.consent, c] };
          } else {
            return {};
          }
        }),
    }),
    { name: "consent-store" }
  )
);

export default useConsentStore;
