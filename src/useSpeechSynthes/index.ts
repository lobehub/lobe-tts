import { useMemo, useState } from 'react';

import { SsmlOptions } from '@/utils/genSSML';

export const useSpeechSynthes = (defaultText: string, { name, rate, pitch }: SsmlOptions) => {
  const [voiceList, setVoiceList] = useState(speechSynthesis.getVoices());
  const [text, setText] = useState<string>(defaultText);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const speechSynthesisUtterance = useMemo(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voiceList.find((item) => item.name === name) as any;
    if (pitch) utterance.pitch = pitch * 10;
    if (rate) utterance.rate = rate * 10;
    return utterance;
  }, [text, voiceList, rate, pitch, name]);

  speechSynthesis.onvoiceschanged = () => {
    setVoiceList(speechSynthesis.getVoices());
  };
  speechSynthesisUtterance.onstart = () => setIsLoading(true);
  speechSynthesisUtterance.onend = () => setIsLoading(false);

  return {
    isLoading,
    setText,
    start: () => speechSynthesis.speak(speechSynthesisUtterance),
    stop: () => {
      speechSynthesis.cancel();
      setIsLoading(false);
    },
  };
};
