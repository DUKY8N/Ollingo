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
      className="px-3 text-ctp-text placeholder-ctp-subtext0 text-center text-sm"
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

  // ref 업데이트를 별도 useEffect로 분리
  useEffect(() => {
    translationRef.current = translation;
  });

  // 디바운싱 로직
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

      <button
        onClick={swapLanguages}
        className="
        w-8 h-8 text-ctp-text hover:text-ctp-blue transition-colors absolute bg-ctp-lavender-50/10 rounded-lg
        "
        aria-label="Swap languages"
        title="Swap languages"
      >
        ⇄
      </button>

      <div className="flex flex-col items-center w-full h-1/2 p-2 bg-ctp-lavender-50/10 rounded">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to translate..."
          className="w-full h-full p-3 resize-none text-ctp-text placeholder-ctp-subtext0 text-lg"
          aria-label="Text to translate"
        />
        <LanguageInput
          value={from}
          onChange={setFrom}
          placeholder="From language"
        />
      </div>
    </div>
  );
}

export default App;
