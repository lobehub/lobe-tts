import { useCallback } from 'react';

import { useAudioRecorder } from '@/react/useAudioRecorder';

import {
  type SpeechRecognitionCoreOptions,
  useSpeechRecognitionCore,
} from './useSpeechRecognitionCore';

export interface SpeechRecognitionRecorderOptions extends SpeechRecognitionCoreOptions {
  onBlobAvailable?: (blob: Blob) => void;
  onStart?: () => void;
  onStop?: () => void;
}

export const useSpeechRecognitionAutoStop = (
  locale: string,
  {
    onStart,
    onStop,
    onBlobAvailable,
    onRecognitionFinish,
    ...rest
  }: SpeechRecognitionRecorderOptions = {},
) => {
  const {
    time,
    formattedTime,
    start: startRecord,
    stop: stopRecord,
    blob,
    url,
  } = useAudioRecorder(onBlobAvailable);
  const { isLoading, start, stop, text } = useSpeechRecognitionCore(locale, {
    onRecognitionFinish: (data) => {
      onRecognitionFinish?.(data);
      stopRecord();
    },
    ...rest,
  });

  const handleStart = useCallback(() => {
    onStart?.();
    start();
    startRecord();
  }, [start, startRecord]);

  const handleStop = useCallback(() => {
    onStop?.();
    stop();
    stopRecord();
  }, [stop, stopRecord]);

  return {
    blob,
    formattedTime,
    isLoading,
    isRecording: isLoading,
    response: new Response(JSON.stringify({ text }), { status: 200 }),
    start: handleStart,
    stop: handleStop,
    text,
    time,
    url,
  };
};
