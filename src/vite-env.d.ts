/// <reference types="vite/client" />

declare global {
  interface Window {
    electronWindow: {
      close: () => Promise<void>;
      setAlwaysOnTop: (alwaysOnTop: boolean) => Promise<boolean>;
      isAlwaysOnTop: () => Promise<boolean>;
    };
    electronClipboard: {
      writeText: (text: string) => Promise<void>;
      readText: () => Promise<string>;
      startWatching: () => Promise<string>;
      stopWatching: () => Promise<void>;
      onChanged: (callback: (text: string) => void) => void;
      removeAllListeners: () => void;
    };
  }
}

export {};
