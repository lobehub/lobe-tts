import { useState } from 'react';
import useSWR from 'swr';

import { type MicrosoftSpeechOptions, fetchMicrosoftSpeech } from '@/services/fetchMicrosoftSpeech';

export const useMicrosoftSpeech = (
  defaultText: string,
  { api, name, pitch, rate, style }: MicrosoftSpeechOptions,
) => {
  const [data, setDate] = useState<AudioBufferSourceNode>();
  const [text, setText] = useState<string>(defaultText);
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const { isLoading } = useSWR(
    shouldFetch ? [name, text].join('-') : null,
    () => fetchMicrosoftSpeech(text, { api, name, pitch, rate, style }),
    {
      onError: () => setShouldFetch(false),
      onSuccess: (audioBufferSource) => {
        setShouldFetch(false);
        setIsPlaying(true);
        setDate(audioBufferSource);
        audioBufferSource.start();
        audioBufferSource.addEventListener('ended', () => {
          setShouldFetch(false);
          setIsPlaying(false);
        });
      },
    },
  );

  return {
    data,
    isLoading: isLoading,
    isPlaying: isPlaying,
    setText,
    start: () => {
      if (isPlaying || shouldFetch) return;
      setShouldFetch(true);
      if (!data) return;
      try {
        setIsPlaying(true);
        data?.start();
      } catch {}
    },
    stop: () => {
      if (!isPlaying) return;
      setShouldFetch(false);
      setIsPlaying(false);
      try {
        data?.stop();
      } catch {}
    },
  };
};
