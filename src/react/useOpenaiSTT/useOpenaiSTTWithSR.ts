import { useCallback, useState } from 'react';

import { useOpenaiSTT } from '@/react/useOpenaiSTT/useOpenaiSTT';
import { useSpeechRecognition } from '@/react/useSpeechRecognition';

import { OpenaiSpeechRecognitionOptions, STTConfig } from './useOpenaiSTTWithRecord';

export const useOpenaiSTTWithSR = (
  locale: string,
  options: OpenaiSpeechRecognitionOptions,
  {
    onBolbAvailable,
    onTextChange,
    onSuccess,
    onError,
    onFinished,
    onStart,
    onStop,
  }: STTConfig = {},
) => {
  const [isGlobalLoading, setIsGlobalLoading] = useState<boolean>(false);
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [text, setText] = useState<string>();
  const {
    start,
    stop,
    blob,
    url,
    isLoading: isRecording,
    time,
    formattedTime,
  } = useSpeechRecognition(locale, {
    onBolbAvailable: (blobData) => {
      setShouldFetch(true);
      onBolbAvailable?.(blobData);
    },
    onTextChange: (data) => {
      setText(data);
      onTextChange?.(data);
    },
  });

  const handleStart = useCallback(() => {
    onStart?.();
    setIsGlobalLoading(true);
    start();
    setText('');
  }, [start]);

  const handleStop = useCallback(() => {
    onStop?.();
    stop();
    setShouldFetch(false);
    setIsGlobalLoading(false);
  }, [stop]);

  const { isLoading } = useOpenaiSTT(shouldFetch, blob, options, {
    onError: (err, ...rest) => {
      onError?.(err, ...rest);
      console.error(err);
      handleStop();
    },
    onSuccess: (data, ...rest) => {
      onSuccess?.(data, ...rest);
      setText(data);
      onTextChange?.(data);
      handleStop();
      onFinished?.(data, ...rest);
    },
  });

  return {
    blob,
    formattedTime,
    isLoading: isGlobalLoading || isLoading || isRecording,
    isRecording,
    start: handleStart,
    stop: handleStop,
    text,
    time,
    url,
  };
};
