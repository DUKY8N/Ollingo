import { playSound } from "../utils/sound";

interface LanguageInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function LanguageInput({
  value,
  onChange,
  placeholder,
}: LanguageInputProps) {
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

