import { useCallback, useState } from 'react';
import type { SWRConfiguration } from 'swr';

import { useAudioRecorder } from '@/react/useAudioRecorder';
import { useOpenAISTTCore } from '@/react/useOpenAISTT/useOpenAISTTCore';
import { type SpeechRecognitionRecorderOptions } from '@/react/useSpeechRecognition/useSpeechRecognitionAutoStop';

import { type OpenAISTTCoreOptions } from './useOpenAISTTCore';

export interface OpenAISTTRecorderOptions
  extends SpeechRecognitionRecorderOptions,
    SWRConfiguration,
    Partial<OpenAISTTCoreOptions> {
  onFinished?: SWRConfiguration['onSuccess'];
}

export const useOpenAISTTRecorder = ({
  onBlobAvailable,
  onTextChange,
  onSuccess,
  onError,
  onFinished,
  onStart,
  onStop,
  options,
  ...restConfig
}: OpenAISTTRecorderOptions = {}) => {
  const [isGlobalLoading, setIsGlobalLoading] = useState<boolean>(false);
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [text, setText] = useState<string>();
  const { start, stop, blob, url, isRecording, time, formattedTime } = useAudioRecorder(
    (blobData) => {
      setShouldFetch(true);
      onBlobAvailable?.(blobData);
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
      console.error('Error useOpenAISTTRecorder:', err);
      handleStop();
    },
    onSuccess: async (res, ...rest) => {
      onSuccess?.(res, ...rest);
      const json = await res.json();
      const text = json.text;
      setText(text);
      onTextChange?.(text);
      handleStop();
      onFinished?.(res, ...rest);
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
