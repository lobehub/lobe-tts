import { useCallback } from 'react';

import { useAudioRecorder } from '@/react/useAudioRecorder';
import { useRecognition } from '@/react/useSpeechRecognition/useRecognition';

export interface SpeechRecognitionOptions {
  onBlobAvailable?: (blob: Blob) => void;
  onTextChange?: (value: string) => void;
}

export const useSpeechRecognition = (
  locale: string,
  { onBlobAvailable, onTextChange }: SpeechRecognitionOptions = {},
) => {
  const {
    time,
    formattedTime,
    start: startRecord,
    stop: stopRecord,
    blob,
    url,
  } = useAudioRecorder(onBlobAvailable);
  const { isLoading, start, stop, text } = useRecognition(locale, {
    onRecognitionEnd: () => {
      stopRecord();
    },
    onTextChange: onTextChange,
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
