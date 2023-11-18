import { throttle } from 'lodash-es';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

export const useAudioVisualizer = (
  audioRef: RefObject<HTMLAudioElement>,
  {
    count = 5,
  }: {
    count: number;
    humanVoice?: boolean;
  },
) => {
  const barsSet = Array.from({ length: (count + 1) / 2 }).fill(0) as number[];
  const [bars, setBars] = useState<number[]>([0, 0, 0, 0]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const audioSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const [init, setInit] = useState(false);

  const renderFrame = throttle(() => {
    animationFrameIdRef.current = requestAnimationFrame(renderFrame);
    if (analyserRef.current && dataArrayRef.current) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      const step = Math.floor(dataArrayRef.current.length / barsSet.length);
      const newBars = barsSet.map((_, i) => {
        return dataArrayRef.current?.[i * step] || 0;
      });
      setBars(newBars);
    }
  }, 50);

  const resetRenderFrame = useCallback(() => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    setBars(barsSet);
  }, []);

  useEffect(() => {
    if (!audioRef.current || !audioRef.current.currentSrc) return;

    try {
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      audioSourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
      audioSourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    } catch (error) {
      console.error('Error useAudioVisualizer:', error);
    }

    setInit(true);
    return () => {
      audioSourceRef.current?.disconnect();
      analyserRef.current?.disconnect();
      audioContextRef.current?.close();
      setInit(false);
    };
  }, [audioRef?.current?.currentSrc]);

  useEffect(() => {
    if (!init) return;
    resetRenderFrame();
    renderFrame();
    return () => {
      resetRenderFrame();
    };
  }, [init]);

  const reverseBars = [...bars].slice(1, bars.length).reverse();
  return [...reverseBars, ...bars];
};
