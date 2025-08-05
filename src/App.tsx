import { useState, useEffect, useRef } from "react";
import { useTranslation } from "./hooks/useTranslation";

const DEBOUNCE_DELAY = 500;
const DEFAULT_LANGUAGES = {
  from: "English",
  to: "Korean",
};

const SOUND_CATEGORIES = {
  tap: ["tap_01.wav", "tap_02.wav", "tap_03.wav", "tap_04.wav", "tap_05.wav"],
  swipe: [
    "swipe_01.wav",
    "swipe_02.wav",
    "swipe_03.wav",
    "swipe_04.wav",
    "swipe_05.wav",
  ],
  type: [
    "type_01.wav",
    "type_02.wav",
    "type_03.wav",
    "type_04.wav",
    "type_05.wav",
  ],
  button: ["button.wav"],
  select: ["select.wav"],
  swipeGeneric: ["swipe.wav"],
  caution: ["caution.wav"],
  celebration: ["celebration.wav"],
  disabled: ["disabled.wav"],
  notification: ["notification.wav"],
  progressLoop: ["progress_loop.wav"],
  ringtoneLoop: ["ringtone_loop.wav"],
  toggleOff: ["toggle_off.wav"],
  toggleOn: ["toggle_on.wav"],
  transitionDown: ["transition_down.wav"],
  transitionUp: ["transition_up.wav"],
} as const;

type SoundCategory = keyof typeof SOUND_CATEGORIES;

const playSound = (category?: SoundCategory | "") => {
  if (!category) return;

  const sounds = SOUND_CATEGORIES[category as SoundCategory];
  const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
  const audio = new Audio(`/src/assets/SND01-sounds/${randomSound}`);
  audio.play().catch(console.error);
};

function LanguageInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="rounded px-3 text-center text-sm text-ctp-subtext0 placeholder-ctp-overlay1 transition-colors hover:bg-ctp-lavender-50/10 hover:text-ctp-text focus:bg-ctp-lavender-50/10 focus:text-ctp-text"
      aria-label={placeholder}
      onMouseEnter={() => playSound("tap")}
      onClick={(e) => {
        (e.target as HTMLInputElement).select();
      }}
    />
  );
}

function IconButton({
  onClick,
  className,
  children,
  ariaLabel,
  title,
  soundCategory,
}: {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
  title?: string;
  soundCategory?: SoundCategory;
}) {
  return (
    <button
      onClick={() => {
        onClick?.();
        playSound(soundCategory);
      }}
      onMouseEnter={() => playSound("tap")}
      className={`cursor-pointer transition-colors ${className || ""}`}
      aria-label={ariaLabel}
      title={title}
    >
      {children}
    </button>
  );
}

function TranslationStatus({
  translation,
}: {
  translation: ReturnType<typeof useTranslation>;
}) {
  if (translation.isPending) {
    return (
      <div
        className="mb-4 h-full w-full p-3 text-lg text-ctp-overlay0"
        role="status"
        aria-live="polite"
      >
        <p>Translating...</p>
      </div>
    );
  }

  if (translation.error) {
    return (
      <div
        className="mb-4 h-full w-full p-3 text-lg text-ctp-red"
        role="alert"
        aria-live="assertive"
      >
        <p>{translation.error.message}</p>
      </div>
    );
  }

  if (translation.data) {
    return (
      <div
        className="mb-4 h-full w-full overflow-y-scroll p-3 text-lg text-ctp-text"
        aria-live="polite"
      >
        <p className="w-fit whitespace-pre-wrap">{translation.data}</p>
      </div>
    );
  }

  return (
    <div className="mb-4 h-full w-full p-3 text-lg text-ctp-overlay0">
      <p>Enter text to see translation</p>
    </div>
  );
}

function App() {
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
}

export default App;
