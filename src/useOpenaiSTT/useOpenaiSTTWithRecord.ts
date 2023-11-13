import { useCallback, useState } from 'react';

import { OpenaiSttOptions } from '@/services/fetchOpenaiSTT';
import { useAudioRecorder } from '@/useAudioRecorder';
import { OpenaiSTTFetcher, useOpenaiSTT } from '@/useOpenaiSTT/useOpenaiSTT';
import { SpeechRecognitionOptions } from '@/useSpeechRecognition/useSpeechRecognition';

export type OpenaiSpeechRecognitionOptions = SpeechRecognitionOptions & OpenaiSttOptions;

export const useOpenaiSTTWithRecord = (
  { onBolbAvailable, onTextChange, ...options }: OpenaiSpeechRecognitionOptions,
  fetcher?: OpenaiSTTFetcher,
) => {
  const [isGlobalLoading, setIsGlobalLoading] = useState<boolean>(false);
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [text, setText] = useState<string>();
  const { start, stop, blob, url, isRecording, time, formattedTime } = useAudioRecorder(
    (blobData) => {
      setShouldFetch(true);
      onBolbAvailable?.(blobData);
    },
  );

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
      onSuccess: (data, value) => {
        setText(data);
        onTextChange?.(value);
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
