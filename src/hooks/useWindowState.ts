import { useEffect } from "react";

interface UseWindowStateProps {
  setIsAlwaysOnTop: (isAlwaysOnTop: boolean) => void;
}

const useWindowState = ({ setIsAlwaysOnTop }: UseWindowStateProps) => {
  useEffect(() => {
    const initializeAlwaysOnTop = async () => {
      const state = await window.electronWindow.isAlwaysOnTop();
      setIsAlwaysOnTop(state);
    };
    
    initializeAlwaysOnTop();
  }, [setIsAlwaysOnTop]);
};

export default useWindowState;