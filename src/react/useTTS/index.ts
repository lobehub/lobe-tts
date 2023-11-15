import { useCallback, useEffect, useState } from 'react';
import useSWR, { type SWRConfiguration } from 'swr';

import { AudioProps } from '@/react/AudioPlayer';
import { useStreamAudioPlayer } from '@/react/hooks/useStreamAudioPlayer';
import { splitTextIntoSegments } from '@/utils/splitTextIntoSegments';

export interface TTSHook extends SWRConfiguration {
  audio: AudioProps;
  isGlobalLoading: boolean;
  isLoading: boolean;
  start: () => void;
  stop: () => void;
}

export interface TTSConfig extends SWRConfiguration {
  onFinish?: SWRConfiguration['onSuccess'];
  onStart?: () => void;
  onStop?: () => void;
}

export const useTTS = (
  key: string,
  text: string,
  fetchTTS: (segmentText: string) => Promise<AudioBuffer>,
  { onError, onSuccess, onFinish, onStart, onStop, ...restSWRConfig }: TTSConfig = {},
): TTSHook => {
  const { load, reset, ...rest } = useStreamAudioPlayer();
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [isGlobalLoading, setIsGlobalLoading] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const [textArray, setTextArray] = useState<string[]>([]);

  const handleReset = useCallback((newText: string[] = []) => {
    setShouldFetch(false);
    setIsGlobalLoading(false);
    reset();
    setIndex(0);
    setTextArray(newText);
  }, []);

  const handleStop = useCallback(() => {
    onStop?.();
    handleReset();
  }, []);

  const { isLoading } = useSWR(
    shouldFetch && textArray?.length > 0 ? [key, textArray?.[index]] : null,
    async () => await fetchTTS(textArray[index]),
    {
      onError: (err, ...rest) => {
        onError?.(err, ...rest);
        console.error(err);
        handleReset();
      },
      onSuccess: (data, ...rest) => {
        onSuccess?.(data, ...rest);
        load(data);
        if (index < textArray.length - 1) {
          setIndex(index + 1);
        } else {
          onFinish?.(data, ...rest);
          setShouldFetch(false);
          setIsGlobalLoading(false);
        }
      },
      ...restSWRConfig,
    },
  );

  const handleStart = useCallback(() => {
    if (isLoading) return;
    onStart?.();
    reset();
    setShouldFetch(true);
    setIsGlobalLoading(true);
  }, [isLoading]);

  useEffect(() => {
    const texts = splitTextIntoSegments(text);
    handleReset(texts);
    return () => {
      handleReset();
    };
  }, [text]);

  return {
    audio: rest,
    isGlobalLoading,
    isLoading,
    start: handleStart,
    stop: handleStop,
  };
};
