import { useCallback, useState } from 'react';

import { useOpenAISTTCore } from '@/react/useOpenAISTT/useOpenAISTTCore';
import { useSpeechRecognitionAutoStop } from '@/react/useSpeechRecognition/useSpeechRecognitionAutoStop';

import { type OpenAISTTRecorderOptions } from './useOpenAISTTRecorder';

export const useOpenAISTTAutoStop = (
  locale: string,
  {
    onBlobAvailable,
    onTextChange,
    onSuccess,
    onError,
    onFinished,
    onStart,
    onStop,
    options,
    onRecognitionStop,
    onRecognitionStart,
    onRecognitionError,
    onRecognitionFinish,
    ...restConfig
  }: OpenAISTTRecorderOptions = {},
) => {
  const [isGlobalLoading, setIsGlobalLoading] = useState<boolean>(false);
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [text, setText] = useState<string>();
  const { start, stop, blob, url, isRecording, time, formattedTime } = useSpeechRecognitionAutoStop(
    locale,
    {
      onBlobAvailable: (blobData) => {
        setShouldFetch(true);
        onBlobAvailable?.(blobData);
      },
      onRecognitionError,
      onRecognitionFinish,
      onRecognitionStart,
      onRecognitionStop,
      onTextChange: (data) => {
        setText(data);
        onTextChange?.(data);
      },
    },
  );

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

  const {
    isLoading,
    error,
    mutate,
    data: response,
  } = useOpenAISTTCore({
    onError: (err, ...rest) => {
      onError?.(err, ...rest);
      console.error('Error useOpenAISTTAutoStop:', err);
      handleStop();
    },
    onSuccess: async (data, ...rest) => {
      onSuccess?.(data, ...rest);
      const json = await data.json();
      const text = json.text;
      setText(text);
      onTextChange?.(text);
      handleStop();
      onFinished?.(data, ...rest);
    },
    options: options!,
    shouldFetch,
    speech: blob as Blob,
    ...restConfig,
  });

  return {
    blob,
    error,
    formattedTime,
    isLoading: isGlobalLoading || isLoading || isRecording,
    isRecording,
    mutate,
    response,
    start: handleStart,
    stop: handleStop,
    text,
    time,
    url,
  };
};
