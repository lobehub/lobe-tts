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
      (window as any)?.webkitSpeechSynthesis
    );
  } catch {}
};

const getSpeechSynthesisUtterance = () => {
  try {
    return (
      (globalThis as any)?.SpeechSynthesisUtterance ||
      (window as any)?.SpeechSynthesisUtterance ||
      (window as any)?.webkitSpeechSynthesisUtterance
    );
  } catch {}
};
export const SpeechRecognition = getSpeechRecognition();
export const SpeechSynthesis = getSpeechSynthesis();
export const SpeechSynthesisUtterance = getSpeechSynthesisUtterance();
