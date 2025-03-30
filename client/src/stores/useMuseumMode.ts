import create from 'zustand';
import { persist } from 'zustand/middleware';

interface MuseumModeState {
  isMuseumMode: boolean;
  enableMuseumMode: () => void;
  disableMuseumMode: () => void;
}

export const useMuseumMode = create<MuseumModeState>()(
  persist(
    (set) => ({
      isMuseumMode: false,
      enableMuseumMode: () => set({ isMuseumMode: true }),
      disableMuseumMode: () => set({ isMuseumMode: false }),
    }),
    {
      name: 'museum-mode-storage',
    }
  )
);
