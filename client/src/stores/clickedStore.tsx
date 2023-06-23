import create from "zustand";

interface didClickState {
  didClick: boolean;
  setDidClick: (didClick: boolean) => void;
}

const useDidClick = create<didClickState>((set) => ({
  didClick: false,
  setDidClick: (b) => set({ didClick: b }),
}));

export default useDidClick;