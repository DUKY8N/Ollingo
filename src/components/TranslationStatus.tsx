import useTranslation from "../hooks/useTranslation";

interface TranslationStatusProps {
  translation: ReturnType<typeof useTranslation>;
}

const TranslationStatus = ({ translation }: TranslationStatusProps) => {
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
};

export default TranslationStatus;

