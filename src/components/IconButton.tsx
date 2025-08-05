import React from "react";
import { playSound, SoundCategory } from "../utils/sound";

type ColorVariant = "default" | "primary" | "danger" | "active";

interface IconButtonProps {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
  title?: string;
  soundCategory?: SoundCategory;
  variant?: ColorVariant;
  isActive?: boolean;
}

const IconButton = ({
  onClick,
  className,
  children,
  ariaLabel,
  title,
  soundCategory,
  variant = "default",
  isActive = false,
}: IconButtonProps) => {
  const variants = {
    default: "text-ctp-subtext0/50 hover:text-ctp-subtext1",
    primary: "text-ctp-subtext0 hover:text-ctp-blue-500",
    danger: "text-ctp-subtext0/50 hover:text-ctp-red",
    active: "text-ctp-blue-500 hover:text-ctp-blue-500",
  };

  const getColorClasses = () => {
    if (isActive) return variants.active;
    return variants[variant];
  };

  const colorClasses = getColorClasses();

  return (
    <button
      onClick={() => {
        onClick?.();
        playSound(soundCategory);
      }}
      onMouseEnter={() => playSound("tap")}
      className={`cursor-pointer transition-colors ${colorClasses} ${className || ""}`}
      aria-label={ariaLabel}
      title={title}
    >
      {children}
    </button>
  );
};

export default IconButton;
