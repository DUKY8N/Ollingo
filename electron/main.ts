import { app, BrowserWindow, ipcMain, clipboard } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    show: false,
    transparent: true,
    frame: false,
    vibrancy: "fullscreen-ui",
    visualEffectState: "active",
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  win.webContents.once("did-finish-load", () => {
    win?.show();
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers
ipcMain.handle("window-close", () => {
  win?.close();
});

ipcMain.handle("window-set-always-on-top", (_, alwaysOnTop: boolean) => {
  win?.setAlwaysOnTop(alwaysOnTop);
  return win?.isAlwaysOnTop() || false;
});

ipcMain.handle("window-is-always-on-top", () => {
  return win?.isAlwaysOnTop() || false;
});

// Clipboard handlers
ipcMain.handle("clipboard-write-text", (_, text: string) => {
  clipboard.writeText(text);
});

ipcMain.handle("clipboard-read-text", () => {
  return clipboard.readText();
});

// Clipboard change monitoring
let lastClipboardContent = "";
let isClipboardWatching = false;

const startClipboardMonitoring = () => {
  setInterval(() => {
    if (!isClipboardWatching) return;

    const currentContent = clipboard.readText();
    if (currentContent !== lastClipboardContent) {
      lastClipboardContent = currentContent;
      win?.webContents.send("clipboard-changed", currentContent);
    }
  }, 500);
};

ipcMain.handle("clipboard-start-watching", () => {
  isClipboardWatching = true;
  lastClipboardContent = clipboard.readText();
  return lastClipboardContent;
});

ipcMain.handle("clipboard-stop-watching", () => {
  isClipboardWatching = false;
});

app.whenReady().then(() => {
  createWindow();
  startClipboardMonitoring();
});
