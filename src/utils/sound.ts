const SOUND_CATEGORIES = {
  tap: ["tap_01.wav", "tap_02.wav", "tap_03.wav", "tap_04.wav", "tap_05.wav"],
  swipe: [
    "swipe_01.wav",
    "swipe_02.wav",
    "swipe_03.wav",
    "swipe_04.wav",
    "swipe_05.wav",
  ],
  type: [
    "type_01.wav",
    "type_02.wav",
    "type_03.wav",
    "type_04.wav",
    "type_05.wav",
  ],
  button: ["button.wav"],
  select: ["select.wav"],
  swipeGeneric: ["swipe.wav"],
  caution: ["caution.wav"],
  celebration: ["celebration.wav"],
  disabled: ["disabled.wav"],
  notification: ["notification.wav"],
  progressLoop: ["progress_loop.wav"],
  ringtoneLoop: ["ringtone_loop.wav"],
  toggleOff: ["toggle_off.wav"],
  toggleOn: ["toggle_on.wav"],
  transitionDown: ["transition_down.wav"],
  transitionUp: ["transition_up.wav"],
} as const;

export type SoundCategory = keyof typeof SOUND_CATEGORIES;

export const playSound = (category?: SoundCategory | "") => {
  if (!category || !(category in SOUND_CATEGORIES)) return;

  const sounds = SOUND_CATEGORIES[category];
  const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
  const audio = new Audio(`./src/assets/SND01-sounds/${randomSound}`);
  audio.play().catch(console.error);
};

