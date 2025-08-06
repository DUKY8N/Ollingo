import { create } from "zustand";

interface TranslationState {
  text: string;
  from: string;
  to: string;

  setText: (text: string) => void;
  setFrom: (from: string) => void;
  setTo: (to: string) => void;
  swapLanguages: () => void;
}

const DEFAULT_LANGUAGES = {
  from: "English",
  to: "Korean",
};

export const useTranslationStore = create<TranslationState>()((set) => ({
  text: "",
  from: DEFAULT_LANGUAGES.from,
  to: DEFAULT_LANGUAGES.to,

  setText: (text) => set({ text }),
  setFrom: (from) => set({ from }),
  setTo: (to) => set({ to }),
  swapLanguages: () => set((state) => ({ from: state.to, to: state.from })),
}));

