import { useEffect } from "react";

interface UseClipboardWatcherProps {
  isEnabled: boolean;
  currentText: string;
  onTextChange: (text: string) => void;
}

const useClipboardWatcher = ({
  isEnabled,
  currentText,
  onTextChange,
}: UseClipboardWatcherProps) => {
  useEffect(() => {
    if (!isEnabled || !window.electronClipboard) return;

    const handleClipboardChange = (newText: string) => {
      if (newText.trim() && newText !== currentText) {
        onTextChange(newText);
      }
    };

    try {
      window.electronClipboard.onChanged(handleClipboardChange);
      window.electronClipboard.startWatching();
    } catch (error) {
      console.error("Failed to start clipboard watching:", error);
      return;
    }

    return () => {
      try {
        if (window.electronClipboard) {
          window.electronClipboard.stopWatching();
          window.electronClipboard.removeAllListeners();
        }
      } catch (error) {
        console.error("Failed to cleanup clipboard watcher:", error);
      }
    };
  }, [isEnabled, currentText, onTextChange]);
};

export default useClipboardWatcher;

