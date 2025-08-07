import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import IconButton from "./IconButton";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (isOpen) document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ctp-crust/70"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative bg-ctp-base border border-ctp-surface0 rounded-xl p-6 w-96 h-64 shadow-xl"
          >
            <div className="absolute top-3 left-5">
              <IconButton
                children="󰳝 "
                onClick={onClose}
                soundCategory="transitionDown"
              />
            </div>

            <div className="flex items-center justify-center h-full text-ctp-subtext1">
              Settings will go here
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
