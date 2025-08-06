import { useState, useEffect } from "react";

interface AppSettings {
  isAlwaysOnTop: boolean;
  isAutoClipboard: boolean;
}

type SettingsKey = keyof AppSettings;

const useSettingsStore = <K extends SettingsKey>(
  key: K,
  fallback?: AppSettings[K],
): [AppSettings[K], (value: AppSettings[K]) => Promise<void>] => {
  const [value, setValue] = useState<AppSettings[K]>(
    fallback ?? (false as AppSettings[K]),
  );
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadInitialValue = async () => {
      try {
        if (window.electronSettings) {
          const storedValue = await window.electronSettings.get(key);
          setValue(storedValue);
        }
      } catch (error) {
        console.warn(`Failed to load electron setting "${key}":`, error);
        if (fallback !== undefined) {
          setValue(fallback);
        }
      } finally {
        setIsInitialized(true);
      }
    };

    loadInitialValue();
  }, [key, fallback]);

  const setValueAndStore = async (newValue: AppSettings[K]): Promise<void> => {
    try {
      setValue(newValue);

      if (window.electronSettings) {
        await window.electronSettings.set(key, newValue);
      }
    } catch (error) {
      console.error(`Failed to save electron setting "${key}":`, error);
      setValue(value);
      throw error;
    }
  };

  return [value, setValueAndStore];
};

export const useAllAppSettings = (): [
  AppSettings | null,
  (settings: Partial<AppSettings>) => Promise<void>,
] => {
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    const loadAllSettings = async () => {
      try {
        if (window.electronSettings) {
          const allSettings = await window.electronSettings.getAll();
          setSettings(allSettings);
        }
      } catch (error) {
        console.warn("Failed to load all electron settings:", error);
      }
    };

    loadAllSettings();
  }, []);

  const updateSettings = async (
    newSettings: Partial<AppSettings>,
  ): Promise<void> => {
    if (!settings) return;

    try {
      const promises = Object.entries(newSettings).map(([key, value]) => {
        if (window.electronSettings) {
          return window.electronSettings.set(
            key as SettingsKey,
            value as boolean,
          );
        }
        return Promise.resolve();
      });

      await Promise.all(promises);
      setSettings({ ...settings, ...newSettings });
    } catch (error) {
      console.error("Failed to update electron settings:", error);
      throw error;
    }
  };

  return [settings, updateSettings];
};

export default useSettingsStore;

