import create  from 'zustand';
import { persist } from 'zustand/middleware';

const INCREMENT_WIDTH = 1;
const INCREMENT_HEIGHT = 1;

interface ImageResizerState {
    width: number;
    height: number;
    incrementWidth: () => void;
    decrementWidth: () => void; 
    incrementHeight: () => void;
    decrementHeight: () => void;
}

export const useImageResizer = create<ImageResizerState>()(
    persist(
        (set) => ({
            width: 100,
            height:   75,
            incrementWidth: () => set((state) => ({ width: state.width + INCREMENT_WIDTH })),
            decrementWidth: () => set((state) => ({ width: state.width - INCREMENT_WIDTH })),
            incrementHeight: () => set((state) => ({ height: state.height + INCREMENT_HEIGHT })),
            decrementHeight: () => set((state) => ({ height: state.height - INCREMENT_HEIGHT }))
        }),
        {
            name: 'image-resizer-storage'
        }
    )
);

