import { useCallback, useState } from 'react';
import useSWR from 'swr';

import { playAudioBlob } from '@/utils/playAudioBlob';

export const useTTS = ({
  fetchTTS,
  setText,
  key,
}: {
  fetchTTS: (props: any) => Promise<Blob>;
  key: string;
  setText: (text: string) => void;
}) => {
  const [keyCache, setKeyCache] = useState<string>();
  const [blob, setBlob] = useState<Blob>();
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [url, setUrl] = useState<string>();
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const { isLoading } = useSWR(shouldFetch ? key : null, fetchTTS, {
    onSuccess: (blob) => {
      const { url, audio } = playAudioBlob(blob);
      setBlob(blob);
      setUrl(url);
      setAudio(audio);
      if (!isPlaying) audio.play();
      audio.addEventListener('play', () => {
        setIsPlaying(true);
      });
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
      });
      setShouldFetch(false);
      setKeyCache(key);
    },
  });

  const handleStart = useCallback(() => {
    if (keyCache !== key) {
      if (audio) {
        audio.remove();
        setAudio(undefined);
      }
      if (url) {
        URL.revokeObjectURL(url);
        setUrl(undefined);
      }
      setBlob(undefined);
      setShouldFetch(true);
      return;
    }
    if (isPlaying || shouldFetch) return;
    if (!audio) return;
    try {
      audio?.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }, [keyCache, key, audio, isPlaying, shouldFetch, url]);

  const handleStop = useCallback(() => {
    if (!isPlaying) return;
    setShouldFetch(false);
    setIsPlaying(false);
    if (!audio) return;
    try {
      audio.pause();
      // @ts-ignore
      audio.currentTime = 0;
    } catch {}
  }, [audio, isPlaying]);

  return {
    audio,
    blob,
    isLoading: isLoading,
    isPlaying: isPlaying,
    setText,
    start: handleStart,
    stop: handleStop,
    url,
  };
};
