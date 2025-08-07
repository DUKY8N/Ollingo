import { create } from "zustand";

interface TranslationState {
  text: string;
  from: string;
  to: string;

  setText: (text: string) => void;
  setFrom: (from: string) => Promise<void>;
  setTo: (to: string) => Promise<void>;
  swapLanguages: () => Promise<void>;
  initializeLanguages: () => Promise<void>;
}

const DEFAULT_LANGUAGES = {
  from: "English",
  to: "Korean",
};

const useTranslationStore = create<TranslationState>()((set, get) => ({
  text: "",
  from: DEFAULT_LANGUAGES.from,
  to: DEFAULT_LANGUAGES.to,

  initializeLanguages: async () => {
    try {
      const [savedFrom, savedTo] = await Promise.all([
        window.electronSettings?.get("fromLanguage"),
        window.electronSettings?.get("toLanguage"),
      ]);

      set({
        from: savedFrom ?? DEFAULT_LANGUAGES.from,
        to: savedTo ?? DEFAULT_LANGUAGES.to,
      });
    } catch (error) {
      console.warn("Failed to load language settings:", error);
    }
  },

  setText: (text) => set({ text }),

  setFrom: async (from) => {
    const previousFrom = get().from;
    try {
      set({ from });
      await window.electronSettings?.set("fromLanguage", from);
    } catch (error) {
      console.error("Failed to save from language:", error);
      set({ from: previousFrom });
      throw error;
    }
  },

  setTo: async (to) => {
    const previousTo = get().to;
    try {
      set({ to });
      await window.electronSettings?.set("toLanguage", to);
    } catch (error) {
      console.error("Failed to save to language:", error);
      set({ to: previousTo });
      throw error;
    }
  },

  swapLanguages: async () => {
    const { from, to } = get();
    const originalFrom = from;
    const originalTo = to;

    try {
      set({ from: to, to: from });

      await Promise.all([
        window.electronSettings?.set("fromLanguage", to),
        window.electronSettings?.set("toLanguage", from),
      ]);
    } catch (error) {
      console.error("Failed to swap languages:", error);
      set({ from: originalFrom, to: originalTo });
      throw error;
    }
  },
}));

export default useTranslationStore;
