const getSpeechRecognition = () => {
  try {
    return (
      (globalThis as any)?.SpeechRecognition ||
      (window as any)?.SpeechRecognition ||
      (window as any)?.webkitSpeechRecognition
    );
  } catch {}
};

const getSpeechSynthesis = () => {
  try {
    return (
      (globalThis as any)?.speechSynthesis ||
      (window as any)?.speechSynthesis ||
      (window as any)?.speechSynthesis
    );
  } catch {}
};

export const SpeechRecognition = getSpeechRecognition();
export const speechSynthesis = getSpeechSynthesis();
