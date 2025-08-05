import { useState, useEffect, useRef } from "react";
import useTranslation from "./hooks/useTranslation";
import LanguageInput from "./components/LanguageInput";
import IconButton from "./components/IconButton";
import TranslationStatus from "./components/TranslationStatus";

const DEBOUNCE_DELAY = 500;
const DEFAULT_LANGUAGES = {
  from: "English",
  to: "Korean",
};

const App = () => {
  const [text, setText] = useState("");
  const [from, setFrom] = useState(DEFAULT_LANGUAGES.from);
  const [to, setTo] = useState(DEFAULT_LANGUAGES.to);
  const translation = useTranslation();
  const translationRef = useRef(translation);

  useEffect(() => {
    translationRef.current = translation;
  });

  useEffect(() => {
    if (!text.trim() || !from.trim() || !to.trim()) return;

    const timer = setTimeout(() => {
      translationRef.current.mutate({ text, from, to });
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [text, from, to]);

  const swapLanguages = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center p-2">
      <div className="relative flex h-1/2 w-full flex-col items-center p-2">
        <div className="relative flex w-full px-3 justify-center items-center">
          <div className="absolute left-2.5 flex gap-4">
            <IconButton className="text-ctp-subtext0/50 hover:text-ctp-subtext1">
              
            </IconButton>
          </div>
          <LanguageInput
            value={to}
            onChange={setTo}
            placeholder="To language"
          />
          <div className="absolute right-2.5 flex gap-4">
            <IconButton
              className="text-ctp-subtext0/50 hover:text-ctp-subtext1"
              soundCategory="toggleOn"
            >
              󰐃
            </IconButton>
            <IconButton className="text-ctp-subtext0/50 hover:text-ctp-red">
              󰅙
            </IconButton>
          </div>
        </div>
        <TranslationStatus translation={translation} />
        <IconButton className="absolute bottom-2 right-4.5 text-ctp-subtext0/50 hover:text-ctp-subtext1">
          󰅍
        </IconButton>
      </div>

      <div className="relative h-1/2 w-full">
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full rounded bg-ctp-lavender-50" />
          <div className="absolute -top-5 left-1/2 h-10 w-10 -translate-x-1/2 rounded-xl border-3 border-ctp-base bg-ctp-lavender-50" />
        </div>

        <div className="relative flex h-full w-full flex-col items-center gap-2 p-2">
          <IconButton
            onClick={swapLanguages}
            className="absolute -top-5 h-10 w-10 rounded-lg border-0 text-ctp-subtext0 hover:text-ctp-blue-500"
            ariaLabel="Swap languages"
            title="Swap languages"
          >
            
          </IconButton>
          <IconButton
            className="absolute top-2 right-4.5 text-ctp-subtext0/50 hover:text-ctp-subtext1"
            soundCategory="toggleOn"
          >
            󰁨
          </IconButton>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to translate..."
            className="mt-4 h-full w-full resize-none p-3 text-lg text-ctp-text placeholder-ctp-overlay1"
            aria-label="Text to translate"
          />
          <LanguageInput
            value={from}
            onChange={setFrom}
            placeholder="From language"
          />
        </div>
      </div>
    </div>
  );
};

export default App;
