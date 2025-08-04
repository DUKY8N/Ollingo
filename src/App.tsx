import { useState, useEffect, useRef } from "react";
import { useTranslation } from "./hooks/useTranslation";

const DEBOUNCE_DELAY = 500;
const DEFAULT_LANGUAGES = {
  from: "English",
  to: "Korean",
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
      className="px-3 text-center text-sm text-ctp-text placeholder-ctp-subtext0"
      aria-label={placeholder}
    />
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
        className="mb-4 h-full w-full p-3 text-lg text-ctp-subtext1"
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
        className="mb-4 h-full w-full p-3 text-lg text-ctp-text"
        aria-live="polite"
      >
        <p>{translation.data}</p>
      </div>
    );
  }

  return (
    <div className="mb-4 h-full w-full p-3 text-lg text-ctp-subtext1">
      <p className="text-ctp-subtext0">Enter text to see translation</p>
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
      <div className="flex h-1/2 w-full flex-col items-center p-2">
        <LanguageInput value={to} onChange={setTo} placeholder="To language" />
        <TranslationStatus translation={translation} />
      </div>

      <div className="relative h-1/2 w-full">
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full rounded bg-ctp-lavender-50" />
          <div className="absolute -top-5 left-1/2 h-10 w-10 -translate-x-1/2 rounded-xl border-3 border-ctp-base bg-ctp-lavender-50" />
        </div>

        <div className="relative flex h-full w-full flex-col items-center p-2">
          <button
            onClick={swapLanguages}
            className="absolute -top-5 h-10 w-10 cursor-pointer rounded-lg border-0 text-ctp-text transition-colors hover:text-ctp-blue-600"
            aria-label="Swap languages"
            title="Swap languages"
          >
            ⇄
          </button>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to translate..."
            className="mt-4 h-full w-full resize-none p-3 text-lg text-ctp-text placeholder-gray-500"
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
