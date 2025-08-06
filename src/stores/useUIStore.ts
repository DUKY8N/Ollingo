import { create } from "zustand";

interface UIState {
  isSwitchHovered: boolean;
  isSwitchPressed: boolean;
  isLanguageAnimating: boolean;

  setIsSwitchHovered: (isSwitchHovered: boolean) => void;
  setIsSwitchPressed: (isSwitchPressed: boolean) => void;
  setIsLanguageAnimating: (isLanguageAnimating: boolean) => void;
}

const useUIStore = create<UIState>()((set) => ({
  isSwitchHovered: false,
  isSwitchPressed: false,
  isLanguageAnimating: false,

  setIsSwitchHovered: (isSwitchHovered) => set({ isSwitchHovered }),
  setIsSwitchPressed: (isSwitchPressed) => set({ isSwitchPressed }),
  setIsLanguageAnimating: (isLanguageAnimating) => set({ isLanguageAnimating }),
}));

export default useUIStore;

