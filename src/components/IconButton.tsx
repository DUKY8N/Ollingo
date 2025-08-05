import React from "react";
import { playSound, SoundCategory } from "../utils/sound";

interface IconButtonProps {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
  title?: string;
  soundCategory?: SoundCategory;
}

export function IconButton({
  onClick,
  className,
  children,
  ariaLabel,
  title,
  soundCategory,
}: IconButtonProps) {
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

