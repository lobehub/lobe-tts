import { throttle } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';

export const useAudioVisualizer = (
  audio: HTMLAudioElement,
  {
    count = 4,
    humanVoice = true,
  }: {
    count: number;
    humanVoice?: boolean;
  },
) => {
  const length = humanVoice ? count * 2 : count;
  const barsSet = Array.from({ length }).fill(0) as number[];
  const [bars, setBars] = useState<number[]>(barsSet);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

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

  useEffect(() => {
    if (!audio) return;
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;
    const analyser = audioContext.createAnalyser();
    analyserRef.current = analyser;
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    dataArrayRef.current = new Uint8Array(bufferLength);

    // 创建音频源
    const audioSource = audioContext.createMediaElementSource(audio);

    audioSource.connect(analyser);

    analyser.connect(audioContext.destination);

    renderFrame();

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      audioSource.disconnect();
      analyser.disconnect();
      audioContext.close();
    };
  }, [audio?.src]);

  return humanVoice ? bars.slice(0, count) : bars;
};
