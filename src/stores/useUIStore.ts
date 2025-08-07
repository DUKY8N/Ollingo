import { create } from "zustand";

interface UIState {
  isSwitchHovered: boolean;
  isSwitchPressed: boolean;
  isLanguageAnimating: boolean;
  isSettingsModalOpen: boolean;

  setIsSwitchHovered: (isSwitchHovered: boolean) => void;
  setIsSwitchPressed: (isSwitchPressed: boolean) => void;
  setIsLanguageAnimating: (isLanguageAnimating: boolean) => void;
  setIsSettingsModalOpen: (isSettingsModalOpen: boolean) => void;
}

const useUIStore = create<UIState>()((set) => ({
  isSwitchHovered: false,
  isSwitchPressed: false,
  isLanguageAnimating: false,
  isSettingsModalOpen: false,

  setIsSwitchHovered: (isSwitchHovered) => set({ isSwitchHovered }),
  setIsSwitchPressed: (isSwitchPressed) => set({ isSwitchPressed }),
  setIsLanguageAnimating: (isLanguageAnimating) => set({ isLanguageAnimating }),
  setIsSettingsModalOpen: (isSettingsModalOpen) => set({ isSettingsModalOpen }),
}));

export default useUIStore;
