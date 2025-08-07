import { useEffect } from "react";
import { motion } from "motion/react";
import useTranslationStore from "./stores/useTranslationStore";
import useUIStore from "./stores/useUIStore";
import {
  useIsAlwaysOnTop,
  useIsAutoClipboard,
} from "./stores/useSettingsStore";
import useClipboardWatcher from "./hooks/useClipboardWatcher";
import useLanguageSwitch from "./hooks/useLanguageSwitch";
import useAutoTranslation from "./hooks/useAutoTranslation";
import LanguageInput from "./components/LanguageInput";
import IconButton from "./components/IconButton";
import TranslationStatus from "./components/TranslationStatus";

import { playSound } from "./utils/sound";

const App = () => {
  const { text, from, to, setText, setFrom, setTo, initializeLanguages } =
    useTranslationStore();
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useIsAlwaysOnTop();
  const [isAutoClipboard, setIsAutoClipboard] = useIsAutoClipboard();
  const {
    isSwitchHovered,
    isSwitchPressed,
    isLanguageAnimating,
    setIsSwitchHovered,
    setIsSwitchPressed,
  } = useUIStore();

  const translation = useAutoTranslation({ text, from, to });
  const { handleLanguageSwitch } = useLanguageSwitch();

  useEffect(() => {
    initializeLanguages();
  }, [initializeLanguages]);

  useClipboardWatcher({
    isEnabled: isAutoClipboard,
    currentText: text,
    onTextChange: setText,
  });

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center p-2">
      <div className="relative flex h-1/2 w-full flex-col items-center p-2">
        <div className="relative flex w-full px-3 justify-center items-center">
          <div className="absolute left-2.5 flex gap-4">
            <IconButton
              children="󰅙 "
              variant="danger"
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
              children="󰐃"
              onClick={() => setIsAlwaysOnTop(!isAlwaysOnTop)}
              isActive={isAlwaysOnTop}
              soundCategory={isAlwaysOnTop ? "toggleOff" : "toggleOn"}
            />
          </div>
        </div>

        <TranslationStatus translation={translation} />
        <IconButton
          children="󰅍 "
          className="absolute bottom-2 right-4.5"
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
            children=" "
            onClick={handleLanguageSwitch}
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
          />
          <IconButton
            children="󰁨 "
            className="absolute top-2 right-4.5"
            onClick={() => setIsAutoClipboard(!isAutoClipboard)}
            isActive={isAutoClipboard}
            soundCategory={isAutoClipboard ? "toggleOff" : "toggleOn"}
            title="Auto-paste from clipboard"
            ariaLabel="Toggle auto-paste from clipboard"
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text..."
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
