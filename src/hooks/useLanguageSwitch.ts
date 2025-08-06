import { useRef } from "react";
import useTranslationStore from "../stores/useTranslationStore";
import useUIStore from "../stores/useUIStore";

const useLanguageSwitch = () => {
  const { swapLanguages } = useTranslationStore();
  const { setIsLanguageAnimating } = useUIStore();
  const switchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLanguageSwitch = () => {
    swapLanguages();
    setIsLanguageAnimating(true);

    if (switchTimeoutRef.current) {
      clearTimeout(switchTimeoutRef.current);
    }

    switchTimeoutRef.current = setTimeout(() => {
      setIsLanguageAnimating(false);
    }, 600);
  };

  return { handleLanguageSwitch };
};

export default useLanguageSwitch;