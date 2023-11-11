import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import useSWR from 'swr';

import { AudioProps } from '@/AudioPlayer';
import { arrayBufferConvert } from '@/utils/arrayBufferConvert';
import { audioBufferToBlob } from '@/utils/audioBufferToBlob';

export interface AudioPlayerHook extends AudioProps {
  isLoading?: boolean;
  ref: RefObject<HTMLAudioElement>;
  reset: () => void;
}

export const useAudioPlayer = (src: string): AudioPlayerHook => {
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);

  const { isLoading } = useSWR(src, async () => {
    setIsGlobalLoading(true);
    const data = await fetch(src);
    const arrayBuffer = await data.arrayBuffer();
    const audioBuffer = await arrayBufferConvert(arrayBuffer);
    const newBlob = await audioBufferToBlob(audioBuffer);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    if (audioRef.current.src) URL.revokeObjectURL(audioRef.current.src);
    audioRef.current.src = URL.createObjectURL(newBlob);
    audioRef.current.load();
  });

  useEffect(() => {
    if (!audioRef.current) return;
    const onLoadedMetadata = () => {
      setDuration(audioRef.current.duration);
      setIsGlobalLoading(false);
    };
    const onTimeUpdate = () => {
      setCurrentTime(audioRef.current.currentTime);
    };
    const onError = () => {
      console.error('Error loading audio:', audioRef.current.error);
    };

    const onEnded = async () => {
      setIsPlaying(false);
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    };

    audioRef.current.addEventListener('ended', onEnded);
    audioRef.current.addEventListener('error', onError);
    audioRef.current.addEventListener('loadedmetadata', onLoadedMetadata);
    audioRef.current.addEventListener('timeupdate', onTimeUpdate);

    return () => {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.removeEventListener('ended', onEnded);
      audioRef.current.removeEventListener('loadedmetadata', onLoadedMetadata);
      audioRef.current.removeEventListener('timeupdate', onTimeUpdate);
      audioRef.current.removeEventListener('error', onError);
      setIsGlobalLoading(true);
    };
  }, []);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    audioRef.current.play();
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    audioRef.current.pause();
  }, []);

  const handleStop = useCallback(() => {
    setIsPlaying(false);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }, []);

  const setTime = useCallback((value: number) => {
    setCurrentTime(value);
    audioRef.current.currentTime = value;
  }, []);

  const reset = useCallback(() => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    if (audioRef.current.src) URL.revokeObjectURL(audioRef.current.src);
    audioRef.current.src = '';
    setDuration(0);
    setCurrentTime(0);
  }, []);

  const handleDownload = useCallback(() => {
    const a = document.createElement('a');
    a.href = audioRef.current.src;
    a.download = 'audio.wav';
    a.click();
  }, []);

  return {
    currentTime,
    download: handleDownload,
    duration,
    isLoading: isLoading || isGlobalLoading,
    isPlaying,
    pause: handlePause,
    play: handlePlay,
    ref: audioRef,
    reset,
    setTime,
    stop: handleStop,
  };
};
