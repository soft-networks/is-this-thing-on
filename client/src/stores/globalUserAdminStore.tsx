import create from "zustand";

interface AdminStore {
  isAdmin: boolean;
  adminFor: string[];
  setIsAdmin: (isAdmin: boolean) => void;
  hideVideo: boolean;
  setHideVideo: (show: boolean) => void;
  stickerBehaviorOverride: BEHAVIOR_TYPES | undefined;
  setStickerBehaviorOverride: (behavior: BEHAVIOR_TYPES | undefined) => void;
  setAdminFor: (adminFor: string[]) => void;
}

export const useGlobalAdminStore = create<AdminStore>((set) => ({
  isAdmin: false,
  adminFor: [],
  setIsAdmin: (isAdmin: boolean) => {
    if (!isAdmin) {
      set({
        stickerBehaviorOverride: undefined,
        hideVideo: false,
        isAdmin: false,
        adminFor: [],
      });
    } else {
      set({ isAdmin: true });
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
  setAdminFor: (adminFor: string[]) => {
    set({ adminFor: adminFor });
  },
}));
