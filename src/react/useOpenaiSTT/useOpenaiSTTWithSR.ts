import { useCallback, useState } from 'react';

import { OpenaiSTTFetcher, useOpenaiSTT } from '@/react/useOpenaiSTT/useOpenaiSTT';
import { useSpeechRecognition } from '@/react/useSpeechRecognition';

import { OpenaiSpeechRecognitionOptions } from './useOpenaiSTTWithRecord';

export const useOpenaiSTTWithSR = (
  locale: string,
  { onBolbAvailable, onTextChange, ...options }: OpenaiSpeechRecognitionOptions,
  fetcher?: OpenaiSTTFetcher,
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
    setIsGlobalLoading(true);
    start();
    setText('');
  }, [start]);

  const handleStop = useCallback(() => {
    stop();
    setShouldFetch(false);
    setIsGlobalLoading(false);
  }, [stop]);

  const { isLoading } = useOpenaiSTT(
    shouldFetch,
    blob,
    options,
    {
      onError: (err) => {
        console.error(err);
        handleStop();
      },
      onSuccess: (data) => {
        setText(data);
        onTextChange?.(data);
        handleStop();
      },
    },
    fetcher,
  );

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
