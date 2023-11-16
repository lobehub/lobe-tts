import { useCallback, useState } from 'react';
import { SWRConfiguration } from 'swr';

import { useAudioRecorder } from '@/react/useAudioRecorder';
import { useOpenAISTTCore } from '@/react/useOpenAISTT/useOpenAISTTCore';
import { SpeechRecognitionRecorderOptions } from '@/react/useSpeechRecognition/useSpeechRecognitionAutoStop';

import { OpenAISTTCoreOptions } from './useOpenAISTTCore';

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

  const { isLoading } = useOpenAISTTCore({
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
    options: options!,
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
