import create from "zustand";

interface AdminStore {
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  hideVideo: boolean;
  setHideVideo: (show: boolean) => void;
  stickerBehaviorOverride: BEHAVIOR_TYPES | undefined;
  setStickerBehaviorOverride: (behavior: BEHAVIOR_TYPES | undefined) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  isAdmin: false,
  setIsAdmin: (isAdmin: boolean) => {
    if (!isAdmin) {
      set({ stickerBehaviorOverride: undefined, hideVideo: false, isAdmin: false });
    } else {
      set({ isAdmin: true })
    }
  },
  hideVideo: false,
  setHideVideo: (hide: boolean) => {
    set({ hideVideo: hide });
  },
  stickerBehaviorOverride: undefined,
  setStickerBehaviorOverride: (behavior: BEHAVIOR_TYPES | undefined) => {
    set({ stickerBehaviorOverride: behavior });
  },
}));
