import { ipcRenderer, contextBridge } from "electron";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args),
    );
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },

  // You can expose other APTs you need here.
  // ...
});

// Window control API
contextBridge.exposeInMainWorld("electronWindow", {
  close: () => ipcRenderer.invoke("window-close"),
  setAlwaysOnTop: (alwaysOnTop: boolean) =>
    ipcRenderer.invoke("window-set-always-on-top", alwaysOnTop),
  isAlwaysOnTop: () => ipcRenderer.invoke("window-is-always-on-top"),
});

// Clipboard API
contextBridge.exposeInMainWorld("electronClipboard", {
  writeText: (text: string) => ipcRenderer.invoke("clipboard-write-text", text),
  readText: () => ipcRenderer.invoke("clipboard-read-text"),
  startWatching: () => ipcRenderer.invoke("clipboard-start-watching"),
  stopWatching: () => ipcRenderer.invoke("clipboard-stop-watching"),
  onChanged: (callback: (text: string) => void) => {
    ipcRenderer.on("clipboard-changed", (_, text) => callback(text));
  },
  removeAllListeners: () => {
    ipcRenderer.removeAllListeners("clipboard-changed");
  },
});

// Settings API
contextBridge.exposeInMainWorld("electronSettings", {
  get: (key: "isAlwaysOnTop" | "isAutoClipboard") =>
    ipcRenderer.invoke("settings-get", key),
  set: (key: "isAlwaysOnTop" | "isAutoClipboard", value: boolean) =>
    ipcRenderer.invoke("settings-set", key, value),
});
