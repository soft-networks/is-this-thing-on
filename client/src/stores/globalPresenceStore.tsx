
import create from "zustand";

interface PresenceStore {
    presenceStats: PresenceStats;
    updatePresenceStats: (presenceStats: PresenceStats) => void;
}

const useGlobalPresenceStore = create<PresenceStore>()((set) => ({
    presenceStats: {},
    updatePresenceStats: (presenceStats: PresenceStats) => set({ presenceStats }),
}));

export default useGlobalPresenceStore;