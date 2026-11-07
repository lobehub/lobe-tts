import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { GiggyTTS, type GiggyTTSAPI, type GiggyTTSPayload } from '@/core/GiggyTTS';
import { type TTSOptions, type TTSResponse, useTTS } from '@/react/useTTS';

import { consumePcmFramesWithBackpressure } from './pcm';

export interface GiggyTTSOptions extends Pick<GiggyTTSPayload, 'options'>, TTSOptions {
  api?: Omit<GiggyTTSAPI, 'apiKey'>;
}

export const useGiggyTTS = (
  defaultText: string,
  init: GiggyTTSOptions,
): TTSResponse & {
  response: Response | undefined;
  setText: Dispatch<SetStateAction<string>>;
} => {
  const [text, setText] = useState<string>(defaultText);
  const { options, api, ...swrConfig } = init;
  if (options.mode !== undefined && options.mode !== 'streaming') {
    throw new Error('useGiggyTTS only supports Streaming mode.');
  }
  if (api && 'apiKey' in api) {
    throw new Error('useGiggyTTS cannot accept apiKey; authenticate in your server proxy.');
  }
  const [response, setResponse] = useState<Response>();
  const [streamLoading, setStreamLoading] = useState(false);
  const [streamError, setStreamError] = useState<Error>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const contextRef = useRef<AudioContext | undefined>(undefined);
  const abortRef = useRef<AbortController | undefined>(undefined);
  const sourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const scheduleRef = useRef(0);
  const startedAtRef = useRef(0);
  const stopStream = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = undefined;
    sourcesRef.current.forEach((source) => {
      try {
        source.stop();
      } catch {
        // The source may already have ended.
      }
    });
    sourcesRef.current = [];
    void contextRef.current?.close();
    contextRef.current = undefined;
    setIsPlaying(false);
    setStreamLoading(false);
    setCurrentTime(0);
    setDuration(0);
    scheduleRef.current = 0;
  }, []);
  useEffect(() => () => stopStream(), [stopStream]);
  const startStream = useCallback(async () => {
    if (!text || streamLoading) return;
    stopStream();
    const controller = new AbortController();
    abortRef.current = controller;
    setStreamError(undefined);
    setStreamLoading(true);
    try {
      const context = new AudioContext({ sampleRate: 24000 });
      contextRef.current = context;
      await context.resume();
      const instance = new GiggyTTS(api);
      const res = await instance.create(
        { input: text, options: { ...options, mode: 'streaming' } },
        controller.signal,
      );
      setResponse(res);
      if (!res.ok || !res.body) {
        const message = await res.text();
        throw new Error(`Giggy TTS request failed (${res.status}): ${message}`);
      }
      let started = false;
      await consumePcmFramesWithBackpressure(
        res.body,
        () => context.currentTime,
        () => scheduleRef.current,
        (frame) => {
          const samples = new DataView(frame.buffer, frame.byteOffset, frame.byteLength);
          const audio = context.createBuffer(1, frame.byteLength / 2, 24000);
          const channel = audio.getChannelData(0);
          for (let i = 0; i < channel.length; i++) {
            channel[i] = samples.getInt16(i * 2, true) / 32768;
          }
          const source = context.createBufferSource();
          source.buffer = audio;
          source.connect(context.destination);
          const when = Math.max(context.currentTime + 0.04, scheduleRef.current);
          if (!started) {
            startedAtRef.current = when;
            started = true;
          }
          source.start(when);
          setIsPlaying(true);
          scheduleRef.current = when + audio.duration;
          sourcesRef.current.push(source);
          source.onended = () => {
            sourcesRef.current = sourcesRef.current.filter((active) => active !== source);
          };
          setDuration((current) => current + audio.duration);
        },
        controller.signal,
      );
      if (controller.signal.aborted) return;
      setStreamLoading(false);
      const tick = () => {
        if (contextRef.current !== context || controller.signal.aborted) return;
        setCurrentTime(Math.max(0, context.currentTime - startedAtRef.current));
        if (context.currentTime < scheduleRef.current) requestAnimationFrame(tick);
        else setIsPlaying(false);
      };
      requestAnimationFrame(tick);
    } catch (error) {
      if (controller.signal.aborted) return;
      stopStream();
      const normalizedError = error instanceof Error ? error : new Error(String(error));
      setStreamError(normalizedError);
    }
  }, [api, options, stopStream, streamLoading, text]);
  const rest = useTTS(
    options.voice,
    text,
    async (segmentText: string) => {
      const instance = new GiggyTTS(api);
      const res = await instance.create({ input: segmentText, options });
      setResponse(res);
      if (!res.ok) {
        const message = await res.text();
        throw new Error(`Giggy TTS request failed (${res.status}): ${message}`);
      }
      return res.arrayBuffer();
    },
    swrConfig,
  );
  const audio: TTSResponse['audio'] = {
    arrayBuffers: [],
    currentTime,
    duration,
    isPlaying,
    play: () => {
      void contextRef.current?.resume();
      setIsPlaying(true);
    },
    pause: () => {
      void contextRef.current?.suspend();
      setIsPlaying(false);
    },
    stop: stopStream,
    setTime: () => {},
    download: () => {},
  };
  return {
    response,
    setText,
    ...rest,
    audio,
    canStart: !!text && !streamLoading,
    error: streamError,
    isLoading: streamLoading,
    isGlobalLoading: streamLoading,
    start: startStream,
    stop: stopStream,
  };
};
