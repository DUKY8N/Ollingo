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
    if (!isEnabled) return;

    const handleClipboardChange = (newText: string) => {
      if (newText.trim() && newText !== currentText) {
        onTextChange(newText);
      }
    };

    window.electronClipboard.onChanged(handleClipboardChange);
    window.electronClipboard.startWatching();

    return () => {
      window.electronClipboard.stopWatching();
      window.electronClipboard.removeAllListeners();
    };
  }, [isEnabled, currentText, onTextChange]);
};

export default useClipboardWatcher;