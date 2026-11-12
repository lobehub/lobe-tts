import type { RefObject } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import useSWR from 'swr';

import type { AudioProps } from '@/react/AudioPlayer';

export interface AudioPlayerResponse extends AudioProps {
  arrayBuffers: ArrayBuffer[];
  download: () => void;
  /**
   * The error raised while loading or playing the audio, if any.
   */
  error?: Error;
  isLoading?: boolean;
  ref: RefObject<HTMLAudioElement>;
  reset: () => void;
  url: string;
}

export interface AudioPlayerOptions {
  /**
   * File name used by `download()`.
   * @default 'audio.mp3'
   */
  filename?: string;
  src?: string;
  /**
   * Hand `src` to the `<audio>` element directly instead of fetching it into a Blob first.
   * The browser then streams the file with range requests, so playback starts before the
   * whole file arrives and a cross-origin URL without CORS headers still plays.
   * `arrayBuffers` stays empty in this mode.
   * @default false
   */
  streaming?: boolean;
  /**
   * MIME type of the Blob built from the fetched data. Ignored when `streaming` is on.
   * @default 'audio/mp3'
   */
  type?: string;
}

const toError = (error: unknown, fallback: string) =>
  error instanceof Error ? error : new Error(fallback);

const mediaErrorToError = (audio: HTMLAudioElement) =>
  new Error(
    audio.error?.message || `Failed to load audio (code ${audio.error?.code ?? 'unknown'})`,
  );

export const useAudioPlayer = ({
  src,
  type = 'audio/mp3',
  streaming = false,
  filename = 'audio.mp3',
}: AudioPlayerOptions = {}): AudioPlayerResponse => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [arrayBuffers, setArrayBuffers] = useState<ArrayBuffer[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);
  const [error, setError] = useState<Error>();

  const getAudio = useCallback(() => {
    if (!audioRef.current) (audioRef as { current: HTMLAudioElement }).current = new Audio();
    return audioRef.current!;
  }, []);

  const revokeBlobSrc = (audio: HTMLAudioElement) => {
    if (audio.src.startsWith('blob:')) URL.revokeObjectURL(audio.src);
  };

  const { isLoading } = useSWR(
    !streaming && src ? src : null,
    async () => {
      if (!src) return;
      setIsGlobalLoading(true);
      setError(undefined);
      const response = await fetch(src);
      if (!response.ok) throw new Error(`Failed to fetch audio: ${response.status}`);
      const arrayBuffer = await response.arrayBuffer();
      setArrayBuffers([arrayBuffer]);
      const newBlob = new Blob([arrayBuffer], { type });
      const audio = getAudio();
      audio.pause();
      audio.currentTime = 0;
      revokeBlobSrc(audio);
      audio.src = URL.createObjectURL(newBlob);
      audio.load();
    },
    {
      onError: (fetchError) => {
        setError(toError(fetchError, 'Failed to fetch audio'));
        setIsGlobalLoading(false);
      },
      revalidateOnFocus: false,
    },
  );

  // Streaming mode: the element loads the URL itself.
  useEffect(() => {
    if (!streaming) return;
    const audio = getAudio();
    audio.pause();
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setError(undefined);
    revokeBlobSrc(audio);

    if (!src) {
      audio.removeAttribute('src');
      setIsGlobalLoading(false);
      return;
    }

    setIsGlobalLoading(true);
    audio.preload = 'metadata';
    audio.src = src;
    audio.load();
  }, [streaming, src, getAudio]);

  useEffect(() => {
    const audio = getAudio();

    const syncDuration = () => {
      // Streams can report Infinity until enough data is buffered.
      if (Number.isFinite(audio.duration)) setDuration(audio.duration);
    };
    const onLoadedMetadata = () => {
      syncDuration();
      setIsGlobalLoading(false);
    };
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      audio.currentTime = 0;
      setCurrentTime(0);
    };
    const onError = () => {
      // An element without a source also fires `error`; only report real failures.
      if (!audio.getAttribute('src')) return;
      setError(mediaErrorToError(audio));
      setIsPlaying(false);
      setIsGlobalLoading(false);
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('durationchange', syncDuration);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('durationchange', syncDuration);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      setIsGlobalLoading(true);
    };
  }, [getAudio]);

  const handlePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setIsPlaying(true);
    const result = audio.play();
    // `play()` rejects asynchronously (autoplay policy, unsupported source, …).
    if (result && typeof result.catch === 'function') {
      result.catch((playError: unknown) => {
        setIsPlaying(false);
        // An interrupted play (pause/load during start) is not a failure.
        if ((playError as Error)?.name === 'AbortError') return;
        setError(toError(playError, 'Failed to play audio'));
      });
    }
  }, []);

  const handlePause = useCallback(() => {
    if (!audioRef.current) return;
    setIsPlaying(false);
    audioRef.current.pause();
  }, []);

  const handleStop = useCallback(() => {
    if (!audioRef.current) return;
    setIsPlaying(false);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
  }, []);

  const setTime = useCallback((value: number) => {
    if (!audioRef.current) return;
    setCurrentTime(value);
    audioRef.current.currentTime = value;
  }, []);

  const reset = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    revokeBlobSrc(audio);
    audio.removeAttribute('src');
    setIsPlaying(false);
    setDuration(0);
    setCurrentTime(0);
    setError(undefined);
  }, []);

  const handleDownload = useCallback(() => {
    const href = audioRef.current?.src;
    if (!href) return;
    const a = document.createElement('a');
    a.href = href;
    a.download = filename;
    a.rel = 'noopener';
    // Browsers ignore `download` for cross-origin URLs and navigate instead; keep the page.
    if (!href.startsWith('blob:')) a.target = '_blank';
    a.click();
  }, [filename]);

  return {
    arrayBuffers,
    currentTime,
    download: handleDownload,
    duration,
    error,
    isLoading: isLoading || (isGlobalLoading && !error),
    isPlaying,
    pause: handlePause,
    play: handlePlay,
    ref: audioRef as any,
    reset,
    setTime,
    stop: handleStop,
    url: audioRef?.current?.src || '',
  };
};
