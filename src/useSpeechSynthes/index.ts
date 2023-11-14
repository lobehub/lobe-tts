import { useCallback, useMemo, useState } from 'react';

import { SsmlOptions } from '@/utils/genSSML';

export const useSpeechSynthes = (defaultText: string, { voice, rate, pitch }: SsmlOptions) => {
  const [voiceList, setVoiceList] = useState(speechSynthesis.getVoices());
  const [text, setText] = useState<string>(defaultText);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const speechSynthesisUtterance = useMemo(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voiceList.find((item) => item.name === voice) as any;
    if (pitch) utterance.pitch = pitch * 10;
    if (rate) utterance.rate = rate * 10;
    return utterance;
  }, [text, voiceList, rate, pitch, voice]);

  speechSynthesis.onvoiceschanged = () => {
    setVoiceList(speechSynthesis.getVoices());
  };
  speechSynthesisUtterance.onstart = () => setIsLoading(true);
  speechSynthesisUtterance.onend = () => setIsLoading(false);

  const handleStart = useCallback(() => {
    speechSynthesis.speak(speechSynthesisUtterance);
  }, [speechSynthesis, speechSynthesisUtterance]);

  const handleStop = useCallback(() => {
    speechSynthesis.cancel();
    setIsLoading(false);
  }, [speechSynthesis]);

  return {
    isLoading,
    setText,
    start: handleStart,
    stop: handleStop,
  };
};
