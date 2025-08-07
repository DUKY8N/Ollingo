/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string;
    /** /dist/ or /public/ */
    VITE_PUBLIC: string;
  }
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import("electron").IpcRenderer;
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
  electronSettings: {
    get(key: "isAlwaysOnTop" | "isAutoClipboard"): Promise<boolean>;
    get(key: "fromLanguage" | "toLanguage"): Promise<string>;
    set(key: "isAlwaysOnTop" | "isAutoClipboard", value: boolean): Promise<boolean>;
    set(key: "fromLanguage" | "toLanguage", value: string): Promise<string>;
  };
}
