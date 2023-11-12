import { useCallback, useState } from 'react';
import useSWR from 'swr';

import { OpenaiSttOptions, fetchOpenaiSTT } from '@/services/fetchOpenaiSTT';
import { useAudioRecorder } from '@/useAudioRecorder';
import { SpeechRecognitionOptions } from '@/useSpeechRecognition/useSpeechRecognition';

export type OpenaiSpeechRecognitionOptions = SpeechRecognitionOptions & OpenaiSttOptions;

export const useOpenaiSTT = ({
  onBolbAvailable,
  onTextChange,
  ...options
}: OpenaiSpeechRecognitionOptions) => {
  const [isGlobalLoading, setIsGlobalLoading] = useState<boolean>(false);
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [text, setText] = useState<string>();
  const { start, stop, blob, url, isRecording, time, formattedTime } = useAudioRecorder(
    (blobData) => {
      setShouldFetch(true);
      onBolbAvailable?.(blobData);
    },
  );

  const key = new Date().getDate().toString();

  const { isLoading } = useSWR(
    shouldFetch && blob ? key : null,
    async () => await fetchOpenaiSTT(blob as any, options),
    {
      onSuccess: (value) => {
        onTextChange?.(value);
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
