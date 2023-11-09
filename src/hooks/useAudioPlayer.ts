import { useCallback, useEffect, useRef, useState } from 'react';

import { secondsToMinutesAndSeconds } from '@/utils/secondsToMinutesAndSeconds';

export const useAudioPlayer = (audio: HTMLAudioElement) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(audio);

  useEffect(() => {
    if (!audio) return;
    const currentAudio = audioRef.current;
    const onLoadedMetadata = () => {
      setDuration(currentAudio.duration);
    };
    const onTimeUpdate = () => {
      setCurrentTime(currentAudio.currentTime);
    };
    const onEnded = () => {
      setIsPlaying(false);
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentTime(0);
    };

    currentAudio.addEventListener('loadedmetadata', onLoadedMetadata);
    currentAudio.addEventListener('timeupdate', onTimeUpdate);
    currentAudio.addEventListener('ended', onEnded);

    return () => {
      currentAudio.pause();
      currentAudio.load();
      currentAudio.removeEventListener('loadedmetadata', onLoadedMetadata);
      currentAudio.removeEventListener('timeupdate', onTimeUpdate);
      currentAudio.removeEventListener('ended', onEnded);
    };
  }, [audio]);

  const hangleTogglePlayPause = useCallback(() => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, audioRef]);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    audioRef.current.play();
  }, [audioRef]);

  const handleStop = useCallback(() => {
    setIsPlaying(false);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }, [audioRef]);

  const setTime = useCallback(
    (value: number) => {
      setCurrentTime(value);
      audioRef.current.currentTime = value;
    },
    [audioRef],
  );

  return {
    currentTime,
    duration,
    formatedCurrentTime: secondsToMinutesAndSeconds(currentTime),
    formatedDuration: secondsToMinutesAndSeconds(duration),
    formatedLeftTime: secondsToMinutesAndSeconds(duration - currentTime),
    isPlaying,
    leftTime: duration - currentTime,
    play: handlePlay,
    setTime,
    stop: handleStop,
    togglePlayPause: hangleTogglePlayPause,
  };
};
