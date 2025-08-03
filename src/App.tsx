import { useState, useEffect, useRef } from "react";
import { useTranslation } from "./hooks/useTranslation";

const DEBOUNCE_DELAY = 500;
const DEFAULT_LANGUAGES = {
  from: "English",
  to: "Korean",
};

function App() {
  const [text, setText] = useState("");
  const [from, setFrom] = useState(DEFAULT_LANGUAGES.from);
  const [to, setTo] = useState(DEFAULT_LANGUAGES.to);
  const translation = useTranslation();

  const translationRef = useRef(translation);
  translationRef.current = translation;

  useEffect(() => {
    if (!text.trim() || !from.trim() || !to.trim()) return;

    const timer = setTimeout(() => {
      translationRef.current.mutate({ text, from, to });
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [text, from, to]);

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen p-8 space-y-6">
      <div className="w-full max-w-2xl space-y-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="From language"
            className="px-3 py-2 border rounded bg-ctp-base text-ctp-text placeholder-ctp-subtext0"
          />
          <span className="self-center text-ctp-text" aria-hidden="true">
            →
          </span>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="To language"
            className="px-3 py-2 border rounded bg-ctp-base text-ctp-text placeholder-ctp-subtext0"
          />
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to translate..."
          className="w-full h-32 p-3 border rounded resize-none bg-ctp-base text-ctp-text placeholder-ctp-subtext0"
        />

        {translation.isPending && (
          <div className="text-center text-ctp-subtext1" role="status">
            Translating...
          </div>
        )}

        {translation.data && (
          <div className="p-4 border rounded bg-ctp-surface0 text-ctp-text">
            <h3 className="font-semibold mb-2">Translation:</h3>
            <p>{translation.data}</p>
          </div>
        )}

        {translation.error && (
          <div
            className="p-4 border rounded bg-ctp-red/10 border-ctp-red text-ctp-red"
            role="alert"
          >
            <h3 className="font-semibold mb-2">Error:</h3>
            <p>{translation.error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
