import { useCallback, useState } from 'react';

import { useOpenAISTTCore } from '@/react/useOpenAISTT/useOpenAISTTCore';
import { useSpeechRecognitionInteractive } from '@/react/useSpeechRecognition/useSpeechRecognitionInteractive';

import { type OpenAISTTRecorderOptions } from './useOpenAISTTRecorder';

export const useOpenAISTTInteractive = (
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
  const { start, stop, blob, url, isRecording, time, formattedTime } =
    useSpeechRecognitionInteractive(locale, {
      onBlobAvailable: (blobData) => {
        if (!text || !blobData) {
          setIsGlobalLoading(false);
          stop();
          return;
        }
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

  const {
    isLoading,
    error,
    mutate,
    data: response,
  } = useOpenAISTTCore({
    onError: (err, ...rest) => {
      onError?.(err, ...rest);
      console.error('Error useOpenAISTTInteractive:', err);
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
