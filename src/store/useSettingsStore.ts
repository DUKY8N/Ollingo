import { create } from "zustand";

interface SettingsState {
  isAlwaysOnTop: boolean;
  isAutoClipboard: boolean;

  setIsAlwaysOnTop: (isAlwaysOnTop: boolean) => void;
  setIsAutoClipboard: (isAutoClipboard: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()((set) => ({
  isAlwaysOnTop: false,
  isAutoClipboard: false,

  setIsAlwaysOnTop: (isAlwaysOnTop) => set({ isAlwaysOnTop }),
  setIsAutoClipboard: (isAutoClipboard) => set({ isAutoClipboard }),
}));

