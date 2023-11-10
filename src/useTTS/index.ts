import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';

import { AudioProps, useStreamAudioPlayer } from '@/hooks/useStreamAudioPlayer';

interface TTSHook {
  audio: AudioProps;
  isGlobalLoading: boolean;
  isLoading: boolean;
  start: () => void;
  stop: () => void;
}

export const useTTS = (
  text: string,
  fetchTTS: (segmentText: string) => Promise<AudioBuffer>,
): TTSHook => {
  const { load, reset, ...rest } = useStreamAudioPlayer();
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [isGlobalLoading, setIsGlobalLoading] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const [textArray, setTextArray] = useState<string[]>([]);

  const { isLoading } = useSWR(
    shouldFetch && textArray?.length > 0 ? textArray?.[index] : null,
    async () => await fetchTTS(textArray[index]),
    {
      onSuccess: (data) => {
        console.log(index, data);
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

  const handleReset = useCallback((newText: string[] = []) => {
    setShouldFetch(false);
    setIsGlobalLoading(false);
    reset();
    setIndex(0);
    setTextArray(newText);
  }, []);

  const handleStart = useCallback(() => {
    if (isLoading) return;
    setShouldFetch(true);
    setIsGlobalLoading(true);
  }, [isLoading]);

  const handleStop = useCallback(() => {
    handleReset();
  }, []);

  useEffect(() => {
    handleReset(text.split('\n').filter(Boolean));
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
