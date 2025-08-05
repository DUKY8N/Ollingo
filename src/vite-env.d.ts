/// <reference types="vite/client" />

declare global {
  interface Window {
    electronWindow: {
      close: () => Promise<void>;
      setAlwaysOnTop: (alwaysOnTop: boolean) => Promise<boolean>;
      isAlwaysOnTop: () => Promise<boolean>;
    };
  }
}

export {};
