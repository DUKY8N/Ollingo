import { motion } from "motion/react";
import { playSound } from "../utils/sound";

interface LanguageInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  triggerAnimation?: boolean;
}

const LanguageInput = ({
  value,
  onChange,
  placeholder,
  triggerAnimation = false,
}: LanguageInputProps) => {
  return (
    <motion.input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      onMouseEnter={() => playSound("tap")}
      onClick={(e) => {
        (e.target as HTMLInputElement).select();
      }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 },
      }}
      whileFocus={{
        scale: 1.05,
        transition: { duration: 0.2 },
      }}
      animate={{
        scale: triggerAnimation ? 1.05 : 1,
        transition: { duration: 0.2 },
      }}
      className={`
        rounded px-3 text-center text-sm text-ctp-subtext0 placeholder-ctp-overlay1 hover:bg-ctp-lavender-50/10 hover:text-ctp-text focus:bg-ctp-lavender-50/10 focus:text-ctp-text transition-colors
        ${triggerAnimation ? "bg-ctp-lavender-50/10 text-ctp-text" : ""}
        `}
    />
  );
};

export default LanguageInput;
