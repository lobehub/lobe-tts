import { useCallback, useEffect, useMemo, useState } from 'react';

import { SpeechSynthesis, SpeechSynthesisUtterance } from '@/core/const/polyfill';
import { type SsmlOptions } from '@/core/utils/genSSML';

export interface SpeechSynthesOptions extends Pick<SsmlOptions, 'voice' | 'rate' | 'pitch'> {
  onStart?: () => void;
  onStop?: () => void;
}
export const useSpeechSynthes = (
  defaultText: string,
  { voice, rate, pitch, ...options }: SpeechSynthesOptions,
) => {
  const [voiceList, setVoiceList] = useState(SpeechSynthesis?.getVoices());
  const [text, setText] = useState<string>(defaultText);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const speechSynthesisUtterance = useMemo(() => {
    if (!SpeechSynthesisUtterance) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voiceList.find((item: any) => item.name === voice) as any;
    if (pitch) utterance.pitch = pitch * 10;
    if (rate) utterance.rate = rate * 10;
    return utterance;
  }, [text, voiceList, rate, pitch, voice]);

  useEffect(() => {
    if (!SpeechSynthesis) return;

    SpeechSynthesis.onvoiceschanged = () => {
      setVoiceList(SpeechSynthesis?.getVoices());
    };
    SpeechSynthesis.onstart = () => setIsLoading(true);
    SpeechSynthesis.onend = () => setIsLoading(false);
  }, []);

  const handleStart = useCallback(() => {
    options?.onStart?.();
    SpeechSynthesis?.speak(speechSynthesisUtterance);
  }, [speechSynthesisUtterance]);

  const handleStop = useCallback(() => {
    options?.onStop?.();
    speechSynthesis?.cancel();
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    setText,
    start: handleStart,
    stop: handleStop,
  };
};
