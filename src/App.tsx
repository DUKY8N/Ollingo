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
      className="px-3 text-sm text-center text-ctp-text placeholder-ctp-subtext0"
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
        className="w-full h-full p-3 text-lg text-ctp-subtext1"
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
        className="w-full h-full p-3 text-lg text-ctp-red"
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
        className="w-full h-full p-3 text-lg text-ctp-text"
        aria-live="polite"
      >
        <p>{translation.data}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-3 text-lg text-ctp-subtext1">
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
    <div className="flex flex-col items-center justify-center w-screen h-screen p-2">
      <div className="flex flex-col items-center w-full h-1/2 p-2">
        <div className="flex items-center gap-2 mb-2">
          <LanguageInput
            value={to}
            onChange={setTo}
            placeholder="To language"
          />
        </div>
        <TranslationStatus translation={translation} />
      </div>

      <div className="relative w-full h-1/2">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full rounded bg-ctp-lavender-50" />
          <div className="absolute left-1/2 w-10 h-10 -top-5 -translate-x-1/2 border-3 border-ctp-base rounded-xl bg-ctp-lavender-50" />
        </div>

        <div className="relative flex flex-col items-center w-full h-full p-2">
          <button
            onClick={swapLanguages}
            className="absolute w-10 h-10 -top-5 rounded-lg border-0 cursor-pointer text-ctp-text hover:text-ctp-blue-600 transition-colors"
            aria-label="Swap languages"
            title="Swap languages"
          >
            ⇄
          </button>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to translate..."
            className="w-full h-full p-3 text-lg resize-none bg-transparent text-ctp-text placeholder-gray-500"
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
