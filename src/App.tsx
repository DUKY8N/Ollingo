import { useState } from "react";
import { useTranslation } from "./hooks/useTranslation";

function App() {
  const [text, setText] = useState("");
  const [from, setFrom] = useState("English");
  const [to, setTo] = useState("Korean");
  const translation = useTranslation();

  const handleTranslate = () => {
    if (text.trim()) {
      translation.mutate({ text, from, to });
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center w-screen h-screen p-8 space-y-6">
        <h1 className="text-4xl text-ctp-text mb-8">Ollingo</h1>
        
        <div className="w-full max-w-2xl space-y-4">
          <div className="flex space-x-4">
            <select 
              value={from} 
              onChange={(e) => setFrom(e.target.value)}
              className="px-3 py-2 border rounded bg-ctp-base text-ctp-text"
            >
              <option value="English">English</option>
              <option value="Korean">Korean</option>
              <option value="Japanese">Japanese</option>
              <option value="Chinese">Chinese</option>
            </select>
            <span className="self-center text-ctp-text">→</span>
            <select 
              value={to} 
              onChange={(e) => setTo(e.target.value)}
              className="px-3 py-2 border rounded bg-ctp-base text-ctp-text"
            >
              <option value="Korean">Korean</option>
              <option value="English">English</option>
              <option value="Japanese">Japanese</option>
              <option value="Chinese">Chinese</option>
            </select>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to translate..."
            className="w-full h-32 p-3 border rounded resize-none bg-ctp-base text-ctp-text placeholder-ctp-subtext0"
          />

          <button
            onClick={handleTranslate}
            disabled={!text.trim() || translation.isPending}
            className="w-full py-2 px-4 bg-ctp-blue text-ctp-base rounded disabled:opacity-50 hover:bg-ctp-sky transition-colors"
          >
            {translation.isPending ? "Translating..." : "Translate"}
          </button>

          {translation.data && (
            <div className="p-4 border rounded bg-ctp-surface0 text-ctp-text">
              <h3 className="font-semibold mb-2">Translation:</h3>
              <p>{translation.data}</p>
            </div>
          )}

          {translation.error && (
            <div className="p-4 border rounded bg-ctp-red/10 border-ctp-red text-ctp-red">
              <h3 className="font-semibold mb-2">Error:</h3>
              <p>{translation.error.message}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
