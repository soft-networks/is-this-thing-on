import create from 'zustand';
import { persist } from 'zustand/middleware';

interface MuseumModeState {
  isMuseumMode: boolean;
  isProjectorMode: boolean;
  enableMuseumMode: () => void;
  disableMuseumMode: () => void;
  enableProjectorMode: () => void;
  disableProjectorMode: () => void;
}

export const useMuseumMode = create<MuseumModeState>()(
  persist(
    (set) => ({
      isMuseumMode: false,
      isProjectorMode: false,
      enableMuseumMode: () => set({ isMuseumMode: true, isProjectorMode: false }),
      disableMuseumMode: () => set({ isMuseumMode: false, isProjectorMode: false }),
      enableProjectorMode: () => set({ isProjectorMode: true, isMuseumMode: false }),
      disableProjectorMode: () => set({ isProjectorMode: false }),
    }),
    {
      name: 'museum-mode-storage',
    }
  )
);
