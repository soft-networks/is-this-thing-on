import create from "zustand";
import { performTransaction } from "../lib/firestore";

interface EnergyStoreState {
  currentUserEnergy: number;
  setCurrentUserEnergy: (energy: number) => void;
}

const useEnergyStore = create<EnergyStoreState>((set) => ({
  currentUserEnergy: 0,
  setCurrentUserEnergy: (energy) => set({ currentUserEnergy: energy }),
}));

export default useEnergyStore;
