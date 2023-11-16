import { useCallback, useState } from 'react';

import { useOpenaiSTT } from '@/react/useOpenaiSTT/useOpenaiSTT';
import { usePersistedSpeechRecognition } from '@/react/useSpeechRecognition';

import { OpenaiSpeechRecognitionOptions, STTConfig } from './useOpenaiSTTWithRecord';

export const useOpenaiSTTWithPSR = (
  locale: string,
  config: OpenaiSpeechRecognitionOptions,
  {
    onBlobAvailable,
    onTextChange,
    onSuccess,
    onError,
    onFinished,
    onStart,
    onStop,
    ...restConfig
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
  } = usePersistedSpeechRecognition(locale, {
    onBlobAvailable: (blobData) => {
      setShouldFetch(true);
      onBlobAvailable?.(blobData);
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

  const { isLoading } = useOpenaiSTT({
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
    options: config.options!,
    shouldFetch,
    speech: blob as Blob,
    ...restConfig,
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
