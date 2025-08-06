import { useEffect, useRef } from "react";
import useTranslation from "../queries/useTranslation";

const DEBOUNCE_DELAY = 500;

interface UseAutoTranslationProps {
  text: string;
  from: string;
  to: string;
}

const useAutoTranslation = ({ text, from, to }: UseAutoTranslationProps) => {
  const translation = useTranslation();
  const translationRef = useRef(translation);

  useEffect(() => {
    translationRef.current = translation;
  });

  useEffect(() => {
    if (!text.trim() || !from.trim() || !to.trim()) {
      if (!text.trim()) {
        translationRef.current.reset();
      }
      return;
    }

    const currentParams = { text, from, to };

    const timer = setTimeout(() => {
      translationRef.current.mutate(currentParams);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [text, from, to]);

  return translation;
};

export default useAutoTranslation;