import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import useSWR from 'swr';

import { AudioProps } from '@/react/AudioPlayer';

export interface AudioPlayerReturn extends AudioProps {
  arrayBuffers: ArrayBuffer[];
  download: () => void;
  isLoading?: boolean;
  ref: RefObject<HTMLAudioElement>;
  reset: () => void;
  url: string;
}

export interface AudioPlayerOptions {
  src?: string;
  type?: string;
}

export const useAudioPlayer = ({
  src,
  type = 'audio/mp3',
}: AudioPlayerOptions = {}): AudioPlayerReturn => {
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const [arrayBuffers, setArrayBuffers] = useState<ArrayBuffer[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);

  const { isLoading } = useSWR(src || null, async () => {
    if (!src) return;
    setIsGlobalLoading(true);
    const data = await fetch(src);
    const arrayBuffer = await data.arrayBuffer();
    setArrayBuffers([arrayBuffer]);
    const newBlob = new Blob([arrayBuffer], { type: type });
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

    const onEnded = async () => {
      setIsPlaying(false);
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    };

    audioRef.current.addEventListener('ended', onEnded);

    audioRef.current.addEventListener('loadedmetadata', onLoadedMetadata);
    audioRef.current.addEventListener('timeupdate', onTimeUpdate);

    return () => {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.removeEventListener('ended', onEnded);
      audioRef.current.removeEventListener('loadedmetadata', onLoadedMetadata);
      audioRef.current.removeEventListener('timeupdate', onTimeUpdate);

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

  const handleDownload = useCallback(async () => {
    const a = document.createElement('a');
    a.href = audioRef.current.src;
    a.download = 'audio.mp3';
    a.click();
  }, []);

  return {
    arrayBuffers: arrayBuffers,
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
    url: audioRef.current.src,
  };
};
