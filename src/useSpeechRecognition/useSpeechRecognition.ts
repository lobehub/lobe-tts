import { useCallback } from 'react';

import { useAudioRecorder } from '@/useAudioRecorder';
import { useRecognition } from '@/useSpeechRecognition/useRecognition';

export const useSpeechRecognition = (
  locale: string,
  options?: { onBolbAvailable?: (blob: Blob) => void; onTextChange?: (value: string) => void },
) => {
  const {
    time,
    formattedTime,
    start: startRecord,
    stop: stopRecord,
    blob,
    url,
  } = useAudioRecorder(options?.onBolbAvailable);
  const { isLoading, start, stop, text } = useRecognition(locale, {
    onRecognitionEnd: () => {
      stopRecord();
    },
    onTextChange: options?.onTextChange,
  });

  const handleStart = useCallback(() => {
    start();
    startRecord();
  }, [start, startRecord]);

  const handleStop = useCallback(() => {
    stop();
    stopRecord();
  }, [stop, stopRecord]);

  return {
    blob,
    formattedTime,
    isLoading,
    start: handleStart,
    stop: handleStop,
    text,
    time,
    url,
  };
};