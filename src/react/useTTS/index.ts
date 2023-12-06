import { useCallback, useEffect, useState } from 'react';
import useSWR, { type SWRConfiguration, type SWRResponse } from 'swr';

import { splitTextIntoSegments } from '@/core/utils/splitTextIntoSegments';
import { type AudioProps } from '@/react/AudioPlayer';
import { useStreamAudioPlayer } from '@/react/hooks/useStreamAudioPlayer';

export interface TTSResponse extends SWRConfiguration, Pick<SWRResponse, 'error' | 'mutate'> {
  audio: AudioProps & {
    arrayBuffers: ArrayBuffer[];
  };
  canStart: boolean;
  isGlobalLoading: boolean;
  isLoading: boolean;
  start: () => void;
  stop: () => void;
}

export interface TTSOptions extends SWRConfiguration {
  onFinish?: SWRConfiguration['onSuccess'];
  onStart?: () => void;
  onStop?: () => void;
}

export const useTTS = (
  key: string,
  text: string,
  fetchTTS: (segmentText: string) => Promise<ArrayBuffer>,
  { onError, onSuccess, onFinish, onStart, onStop, ...restSWRConfig }: TTSOptions = {},
): TTSResponse => {
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [isGlobalLoading, setIsGlobalLoading] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const [textArray, setTextArray] = useState<string[]>([]);
  const { load, reset, ...restAudio } = useStreamAudioPlayer();

  const handleReset = useCallback((newText: string[] = []) => {
    setShouldFetch(false);
    setIsGlobalLoading(false);
    reset();
    setIndex(0);
    setTextArray(newText);
  }, []);

  const handleStop = useCallback(() => {
    onStop?.();
    handleReset([]);
  }, [handleReset]);

  const { isLoading, error, mutate } = useSWR(
    shouldFetch && textArray?.length > 0 ? [key, textArray?.[index]] : null,
    async () => await fetchTTS(textArray[index]),
    {
      onError: (err, ...rest) => {
        onError?.(err, ...rest);
        console.error('Error useTTS:', err);
        handleReset();
      },
      onSuccess: (data, ...rest) => {
        onSuccess?.(data, ...rest);
        load(data);
        if (index < textArray.length - 1) {
          setIndex(index + 1);
        } else {
          onFinish?.([...restAudio.arrayBuffers, data].filter(Boolean), ...rest);
          setShouldFetch(false);
          setIsGlobalLoading(false);
        }
      },
      ...restSWRConfig,
    },
  );

  const handleStart = useCallback(() => {
    if (!text || isLoading) return;
    onStart?.();
    reset();
    setShouldFetch(true);
    setIsGlobalLoading(true);
  }, [text, isLoading]);

  useEffect(() => {
    const texts = splitTextIntoSegments(text);
    handleReset(texts);
    return () => {
      handleReset();
    };
  }, [text]);

  return {
    audio: restAudio,
    canStart: !isLoading && !!text,
    error,
    isGlobalLoading,
    isLoading,
    mutate,
    start: handleStart,
    stop: handleStop,
  };
};
