import { useState, useEffect } from "react";

export const useIsAlwaysOnTop = (): [
  boolean,
  (value: boolean) => Promise<void>,
] => {
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);

  useEffect(() => {
    const initializeState = async () => {
      try {
        const windowState = await window.electronWindow.isAlwaysOnTop();
        setIsAlwaysOnTop(windowState);
      } catch (error) {
        console.warn("Failed to get window state:", error);
      }
    };

    initializeState();
  }, []);

  const toggle = async (value: boolean): Promise<void> => {
    try {
      await window.electronWindow.setAlwaysOnTop(value);
      await window.electronSettings?.set("isAlwaysOnTop", value);
      setIsAlwaysOnTop(value);
    } catch (error) {
      console.error("Failed to set always on top:", error);
      throw error;
    }
  };

  return [isAlwaysOnTop, toggle];
};

export const useIsAutoClipboard = (): [
  boolean,
  (value: boolean) => Promise<void>,
] => {
  const [isAutoClipboard, setIsAutoClipboard] = useState(false);

  useEffect(() => {
    const loadSetting = async () => {
      try {
        const saved = await window.electronSettings?.get("isAutoClipboard");
        setIsAutoClipboard(saved ?? false);
      } catch (error) {
        console.warn("Failed to load auto clipboard setting:", error);
      }
    };

    loadSetting();
  }, []);

  const toggle = async (value: boolean): Promise<void> => {
    try {
      await window.electronSettings?.set("isAutoClipboard", value);
      setIsAutoClipboard(value);
    } catch (error) {
      console.error("Failed to save auto clipboard setting:", error);
      setIsAutoClipboard(isAutoClipboard);
      throw error;
    }
  };

  return [isAutoClipboard, toggle];
};
