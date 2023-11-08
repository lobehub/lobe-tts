import { useCallback, useState } from 'react';
import useSWR from 'swr';

import { OpenaiSttOptions, fetchOpenaiSTT } from '@/services/fetchOpenaiSTT';
import { useSpeechRecognition } from '@/useSpeechRecognition';

export const useOpenaiSTTWithSR = (locale: string, options: OpenaiSttOptions) => {
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
    onBolbAvailable: () => setShouldFetch(true),
    onTextChange: setText,
  });

  const key = new Date().getDate().toString();

  const { isLoading } = useSWR(
    shouldFetch && blob ? key : null,
    async () => await fetchOpenaiSTT(blob as any, options),
    {
      onSuccess: (data) => {
        setShouldFetch(false);
        setText(data);
      },
    },
  );

  const handleStart = useCallback(() => {
    start();
    setText('');
  }, [start]);

  return {
    blob,
    formattedTime,
    isLoading: isLoading || isRecording,
    isRecording,
    start: handleStart,
    stop,
    text,
    time,
    url,
  };
};
