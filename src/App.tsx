import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import useTranslation from "./hooks/useTranslation";
import LanguageInput from "./components/LanguageInput";
import IconButton from "./components/IconButton";
import TranslationStatus from "./components/TranslationStatus";
import { playSound } from "./utils/sound";

const DEBOUNCE_DELAY = 500;
const DEFAULT_LANGUAGES = {
  from: "English",
  to: "Korean",
};

const App = () => {
  const [text, setText] = useState("");
  const [from, setFrom] = useState(DEFAULT_LANGUAGES.from);
  const [to, setTo] = useState(DEFAULT_LANGUAGES.to);
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);
  const [isAutoClipboard, setIsAutoClipboard] = useState(false);
  const [isSwitchHovered, setIsSwitchHovered] = useState(false);
  const [isSwitchPressed, setIsSwitchPressed] = useState(false);
  const [isLanguageAnimating, setIsLanguageAnimating] = useState(false);
  const switchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const translation = useTranslation();
  const translationRef = useRef(translation);

  useEffect(() => {
    translationRef.current = translation;
  });

  useEffect(() => {
    const initializeAlwaysOnTop = async () => {
      const state = await window.electronWindow.isAlwaysOnTop();
      setIsAlwaysOnTop(state);
    };

    initializeAlwaysOnTop();
  }, []);

  useEffect(() => {
    if (!isAutoClipboard) return;

    const handleClipboardChange = (newText: string) => {
      if (newText.trim() && newText !== text) {
        setText(newText);
      }
    };

    window.electronClipboard.onChanged(handleClipboardChange);
    window.electronClipboard.startWatching();

    return () => {
      window.electronClipboard.stopWatching();
      window.electronClipboard.removeAllListeners();
    };
  }, [isAutoClipboard, text]);

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
            <IconButton
              variant="danger"
              children="󰅙 "
              onClick={() => window.electronWindow.close()}
            />
          </div>
          <LanguageInput
            value={to}
            onChange={setTo}
            placeholder="To language"
            triggerAnimation={isLanguageAnimating}
          />
          <div className="absolute right-2.5 flex gap-4">
            <IconButton children=" " />
            <IconButton
              soundCategory={isAlwaysOnTop ? "toggleOff" : "toggleOn"}
              children="󰐃"
              onClick={async () => {
                await window.electronWindow.setAlwaysOnTop(!isAlwaysOnTop);
                setIsAlwaysOnTop(!isAlwaysOnTop);
              }}
              isActive={isAlwaysOnTop}
            />
          </div>
        </div>

        <TranslationStatus translation={translation} />
        <IconButton
          className="absolute bottom-2 right-4.5"
          children="󰅍 "
          onClick={() => {
            if (translation.data) {
              window.electronClipboard.writeText(translation.data);
            }
          }}
        />
      </div>

      <div className="relative h-1/2 w-full">
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full rounded bg-ctp-lavender-50" />
          <motion.div
            className={`
              absolute -top-5 left-1/2 h-10 w-10 -translate-x-1/2 rounded-xl border-3 border-ctp-base transition-colors duration-200
              ${isSwitchHovered ? "bg-ctp-blue" : "bg-ctp-lavender-50"}
            `}
            animate={{
              scale: isSwitchPressed ? 0.95 : 1,
              transition: { duration: isSwitchPressed ? 0.1 : 0.2 },
            }}
          />
        </div>

        <div className="relative flex h-full w-full flex-col items-center gap-2 p-2">
          <motion.button
            onClick={() => {
              swapLanguages();
              setIsLanguageAnimating(true);

              if (switchTimeoutRef.current)
                clearTimeout(switchTimeoutRef.current);

              switchTimeoutRef.current = setTimeout(() => {
                setIsLanguageAnimating(false);
              }, 600);
            }}
            onMouseDown={() => setIsSwitchPressed(true)}
            onMouseUp={() => setIsSwitchPressed(false)}
            onMouseEnter={() => {
              playSound("tap");
              setIsSwitchHovered(true);
            }}
            onMouseLeave={() => {
              setIsSwitchHovered(false);
              setIsSwitchPressed(false);
            }}
            className="absolute -top-5 h-10 w-10 rounded-lg border-0 cursor-pointer transition-colors text-ctp-subtext0 hover:text-ctp-blue-500"
            aria-label="Swap languages"
            title="Swap languages"
            whileTap={{
              scale: 0.95,
              transition: { duration: 0.1 },
            }}
            children=" "
          />
          <IconButton
            className="absolute top-2 right-4.5"
            children="󰁨 "
            soundCategory={isAutoClipboard ? "toggleOff" : "toggleOn"}
            onClick={() => setIsAutoClipboard(!isAutoClipboard)}
            isActive={isAutoClipboard}
            title="Auto-paste from clipboard"
            ariaLabel="Toggle auto-paste from clipboard"
          />
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
            triggerAnimation={isLanguageAnimating}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
