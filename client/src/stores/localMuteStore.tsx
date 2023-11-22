//Create a store that stores user consent, which can be true or false. persist it. use zustand

import create from "zustand";

interface LocalMuteStore {
  localMuted: boolean;
  setLocalMuted: (muted: boolean) => void;
}

const useLocalMutedStore = create<LocalMuteStore>((set) => ({
  localMuted: false,
  setLocalMuted: (muted) => set({ localMuted: muted }),
}));

export default useLocalMutedStore;
