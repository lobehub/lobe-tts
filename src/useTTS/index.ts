import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';

import { AudioProps } from '@/AudioPlayer';
import { useStreamAudioPlayer } from '@/hooks/useStreamAudioPlayer';
import { splitTextIntoSegments } from '@/utils/splitTextIntoSegments';

export interface TTSHook {
  audio: AudioProps;
  isGlobalLoading: boolean;
  isLoading: boolean;
  start: () => void;
  stop: () => void;
}

export const useTTS = (
  key: string,
  text: string,
  fetchTTS: (segmentText: string) => Promise<AudioBuffer>,
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
    handleReset();
  }, []);

  const { isLoading } = useSWR(
    shouldFetch && textArray?.length > 0 ? [key, textArray?.[index]] : null,
    async () => await fetchTTS(textArray[index]),
    {
      onError: (err) => {
        console.error(err);
        handleReset();
      },
      onSuccess: (data) => {
        load(data);
        if (index < textArray.length - 1) {
          setIndex(index + 1);
        } else {
          setShouldFetch(false);
          setIsGlobalLoading(false);
        }
      },
    },
  );

  const handleStart = useCallback(() => {
    if (isLoading) return;
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
