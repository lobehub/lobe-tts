import { useCallback, useMemo, useState } from 'react';

import { useAudioRecorder } from '@/useAudioRecorder';
import { useRecognition } from '@/useSpeechRecognition/useRecognition';

export const usePersistedSpeechRecognition = (
  locale: string,
  options?: { onBolbAvailable?: (blob: Blob) => void; onTextChange?: (value: string) => void },
) => {
  const [texts, setTexts] = useState<string[]>([]);
  const [isGLobalLoading, setIsGlobalLoading] = useState<boolean>(false);
  const {
    time,
    formattedTime,
    start: startRecord,
    stop: stopRecord,
    blob,
    url,
  } = useAudioRecorder(options?.onBolbAvailable);
  const { text, stop, start, isLoading } = useRecognition(locale, {
    onRecognitionEnd: () => {
      if (isGLobalLoading && !isLoading) {
        if (text) setTexts([...texts, text]);
        start();
      }
    },
  });

  const handleStart = useCallback(() => {
    setTexts([]);
    setIsGlobalLoading(true);
    start();
    startRecord();
  }, [start, startRecord]);

  const handleStop = useCallback(() => {
    stop();
    stopRecord();
    setIsGlobalLoading(false);
  }, [stop, stopRecord]);

  const resultText = useMemo(() => {
    const mergedText = [...texts, text].filter(Boolean).join(' ');
    options?.onTextChange?.(mergedText);
    return mergedText;
  }, [texts, text, options?.onTextChange]);

  return {
    blob,
    formattedTime,
    isLoading: isGLobalLoading,
    start: handleStart,
    stop: handleStop,
    text: resultText,
    time,
    url,
  };
};
