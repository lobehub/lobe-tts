import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

import { AudioProps } from '@/AudioPlayer';
import { audioBufferToBlob, audioBuffersToBlob } from '@/utils/audioBufferToBlob';

export interface StreamAudioPlayerHook extends AudioProps {
  download: () => void;
  load: (audioBuffer: AudioBuffer) => void;
  ref: RefObject<HTMLAudioElement>;
  reset: () => void;
}

export const useStreamAudioPlayer = (): StreamAudioPlayerHook => {
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const [audioBuffers, setAudioBuffer] = useState<AudioBuffer[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [maxLength, setMaxLength] = useState(0);

  useEffect(() => {
    if (!audioRef.current) return;
    const onLoadedMetadata = () => {
      setDuration(audioRef.current.duration);
    };
    const onTimeUpdate = () => {
      setCurrentTime(audioRef.current.currentTime);
    };
    const onError = () => {
      console.error('Error loading audio:', audioRef.current.error);
    };

    audioRef.current.addEventListener('error', onError);
    audioRef.current.addEventListener('loadedmetadata', onLoadedMetadata);
    audioRef.current.addEventListener('timeupdate', onTimeUpdate);

    return () => {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.removeEventListener('loadedmetadata', onLoadedMetadata);
      audioRef.current.removeEventListener('timeupdate', onTimeUpdate);
      audioRef.current.removeEventListener('error', onError);
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    const onEnded = async () => {
      audioRef.current.pause();
      if (maxLength < audioBuffers.length) {
        const cacheTime = audioRef.current.currentTime;
        const newBlob = await audioBuffersToBlob(audioBuffers);
        if (audioRef.current.src) URL.revokeObjectURL(audioRef.current.src);
        const newUrl = URL.createObjectURL(newBlob);
        audioRef.current.src = newUrl;
        audioRef.current.load();
        audioRef.current.currentTime = cacheTime;
        audioRef.current.play();
        setMaxLength(audioBuffers.length);
      } else {
        setIsPlaying(false);
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
      }
    };

    audioRef.current.addEventListener('ended', onEnded);

    return () => {
      audioRef.current.removeEventListener('ended', onEnded);
    };
  }, [maxLength, audioBuffers]);

  const addAudioBuffer = useCallback(
    async (audioBuffer: AudioBuffer) => {
      if (maxLength === 0) {
        const newBlob = await audioBufferToBlob(audioBuffer);
        audioRef.current.src = URL.createObjectURL(newBlob);
        audioRef.current.load();
        audioRef.current.play();
        setIsPlaying(true);
        setMaxLength(1);
      }
      setAudioBuffer((prev) => [...prev, audioBuffer]);
    },
    [maxLength],
  );

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
    setAudioBuffer([]);
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
    isPlaying,
    load: addAudioBuffer,
    pause: handlePause,
    play: handlePlay,
    ref: audioRef,
    reset,
    setTime,
    stop: handleStop,
  };
};
