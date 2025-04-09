// src/stores/scanningStore.ts
import create from 'zustand';

interface ScanningState {
    isScanning: boolean;
    setIsScanning: (value: boolean) => void;
}

const useScanningStore = create<ScanningState>((set) => ({
    isScanning: false,
    setIsScanning: (value: boolean) => set({ isScanning: value }),
}));

export default useScanningStore;