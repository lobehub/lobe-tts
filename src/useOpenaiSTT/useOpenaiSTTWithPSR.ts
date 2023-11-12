import { useCallback, useState } from 'react';
import useSWR from 'swr';

import { fetchOpenaiSTT } from '@/services/fetchOpenaiSTT';
import { usePersistedSpeechRecognition } from '@/useSpeechRecognition';

import { OpenaiSpeechRecognitionOptions } from './useOpenaiSTT';

export const useOpenaiSTTWithPSR = (
  locale: string,
  { onBolbAvailable, onTextChange, ...options }: OpenaiSpeechRecognitionOptions,
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
    onBolbAvailable: (blobData) => {
      setShouldFetch(true);
      onBolbAvailable?.(blobData);
    },
    onTextChange: (data) => {
      setText(data);
      onTextChange?.(data);
    },
  });

  const key = new Date().getDate().toString();

  const { isLoading } = useSWR(
    shouldFetch && blob ? key : null,
    async () => await fetchOpenaiSTT(blob as any, options),
    {
      onSuccess: (data) => {
        setShouldFetch(false);
        setText(data);
        onTextChange?.(data);
        setIsGlobalLoading(false);
      },
    },
  );

  const handleStart = useCallback(() => {
    setIsGlobalLoading(true);
    start();
    setText('');
  }, [start]);

  return {
    blob,
    formattedTime,
    isLoading: isGlobalLoading || isLoading || isRecording,
    isRecording,
    start: handleStart,
    stop,
    text,
    time,
    url,
  };
};
